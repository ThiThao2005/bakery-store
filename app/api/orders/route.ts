import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// ===== HÀM TẠO MÃ ĐƠN HÀNG NGẪU NHIÊN =====
const generateOrderCode = () => `BK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

// ===== CẤU HÌNH SUPABASE =====
// Sử dụng Service Role Key để có quyền bypass RLS khi tạo đơn hàng
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Thiếu cấu hình Supabase Env Vars!");
}

// ===== RATE LIMIT (GIỚI HẠN TẦN SUẤT) =====
const rateMap = new Map<string, { count: number; time: number }>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 60000; // 1 phút
  const limit = 5;        // Tối đa 5 đơn hàng/phút từ 1 IP
  
  const record = rateMap.get(ip);
  if (!record || now - record.time > windowMs) {
    rateMap.set(ip, { count: 1, time: now });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

// ===== XỬ LÝ REQUEST POST =====
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // 1. Kiểm tra giới hạn lượt gửi đơn
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Bạn đang đặt hàng quá nhanh. Vui lòng đợi 1 phút." }, 
      { status: 429 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload không hợp lệ." }, { status: 400 });
  }

  const { customerName, phone, address, note, items } = body;

  // 2. Kiểm tra dữ liệu đầu vào (Validation)
  if (!customerName || !phone || !address || !items || items.length === 0) {
    return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin đặt hàng." }, { status: 400 });
  }

  try {
    // 3. Lấy thông tin User nếu đang đăng nhập
    const { data: { user } } = await supabase.auth.getUser();

    // 4. Kiểm tra giá từ DB (Tránh trường hợp khách sửa giá ở Client)
    const productIds = items.map((i: any) => i.productId);
    const { data: products, error: pError } = await supabase
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    if (pError || !products) {
      throw new Error("Không thể truy xuất dữ liệu sản phẩm.");
    }

    // Tính toán tổng tiền thực tế dựa trên giá trong Database
    let total_price = 0;
    const orderItemsPayload = items.map((item: any) => {
      const productInDb = products.find(p => p.id === item.productId);
      if (!productInDb) throw new Error(`Sản phẩm ID ${item.productId} không tồn tại.`);
      
      const lineTotal = productInDb.price * item.quantity;
      total_price += lineTotal;

      return {
        product_id: productInDb.id,
        quantity: item.quantity,
        price_at_time: productInDb.price // Lưu giá lúc mua để làm lịch sử đơn hàng
      };
    });

    // 5. Insert vào bảng orders
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user?.id || null, // Nếu chưa login thì để null
        customer_name: customerName,
        phone,
        address,
        total_price: total_price,     // Khớp với sơ đồ DB: total_price
        status: "pending",            // Trạng thái chờ xử lý
        order_code: generateOrderCode() // Tạo mã code ví dụ BK-A1B2C3D
      })
      .select("id, order_code")
      .single();

    if (orderError) throw orderError;

    // 6. Insert danh sách bánh vào bảng order_items
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(
        orderItemsPayload.map((item: { product_id: number; quantity: number; price_at_time: number }) => ({
          ...item,
          order_id: order.id
        }))
      );

    if (itemsError) {
      // ROLLBACK: Nếu lưu chi tiết đơn hàng lỗi, xóa luôn cái đơn vừa tạo cho sạch DB
      await supabase.from("orders").delete().eq("id", order.id);
      throw itemsError;
    }

    // Trả về kết quả thành công
    return NextResponse.json({ 
      success: true, 
      orderId: order.id, 
      orderCode: order.order_code,
      total: total_price
    }, { status: 201 });

  } catch (error: any) {
    console.error("ORDER_POST_ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi khi xử lý đơn hàng." }, 
      { status: 500 }
    );
  }
}