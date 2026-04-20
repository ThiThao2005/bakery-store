import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import AddToCartDetail from "@/components/AddToCartDetail";

export const revalidate = 60; // Tự động làm mới dữ liệu sau mỗi 60 giây

// Hàm fetch dữ liệu sản phẩm từ Supabase
async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

// Lưu ý: params trong Next.js mới là một Promise
export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // BƯỚC QUAN TRỌNG: await params trước khi lấy id
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound(); // Trả về trang 404 nếu không tìm thấy bánh
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* PHẦN 1: ẢNH SẢN PHẨM PHÓNG TO */}
          <div className="relative aspect-square overflow-hidden rounded-[3rem] shadow-2xl border-8 border-pink-50">
            <img 
              src={product.image_url || "/placeholder-cake.jpg"} 
              alt={product.name}
              className="h-full w-full object-cover transition-transform hover:scale-110 duration-700"
            />
          </div>

          {/* PHẦN 2: THÔNG TIN CHI TIẾT */}
          <div className="space-y-6">
            <div>
              <span className="text-pink-500 font-black uppercase tracking-widest text-sm">
                {product.category || "Bánh đặc biệt"}
              </span>
              <h1 className="text-5xl font-black text-gray-800 mt-2 tracking-tighter">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-pink-600 mt-4">
                {product.price.toLocaleString()}đ
              </p>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              {product.description || "Một tuyệt tác từ những nguyên liệu tươi ngon nhất, mang đến hương vị ngọt ngào khó quên cho mọi dịp kỷ niệm."}
            </p>

            {/* BOX THÔNG TIN DINH DƯỠNG */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thành phần</p>
                <p className="font-bold text-gray-700">Tự nhiên 100%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lượng Calo</p>
                <p className="font-bold text-gray-700">~350 kcal</p>
              </div>
            </div>

            {/* NÚT MUA HÀNG (CLIENT COMPONENT) */}
            <div className="pt-6">
              <AddToCartDetail 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url || ""
                }} 
              />
            </div>

            {/* TRUST BADGES */}
            <div className="pt-8 border-t border-gray-100 flex flex-wrap items-center gap-6 text-sm text-gray-400 font-bold uppercase tracking-tight">
              <div className="flex items-center gap-2">
                <i className="fas fa-truck text-pink-400"></i> Giao nhanh 30p
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-certificate text-pink-400"></i> Bánh mới mỗi ngày
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN 3: MÔ TẢ PHỤ CHI TIẾT */}
        <div className="mt-24 border-t border-gray-50 pt-16">
          <h3 className="text-3xl font-black text-gray-800 mb-8">Tại sao bạn nên chọn chiếc bánh này?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-600 leading-relaxed text-lg font-medium">
            <p>
              Mỗi chiếc <strong>{product.name}</strong> được nướng mới mỗi sáng tại tiệm. Chúng tôi sử dụng bơ lạt nhập khẩu từ Pháp, bột mì hảo hạng và đường hữu cơ để đảm bảo vị ngọt thanh khiết nhất. 
            </p>
            <p>
              Bánh không chứa chất bảo quản, cực kỳ an toàn cho trẻ em và người cao tuổi. Một món quà hoàn hảo cho sinh nhật, tiệc trà hay đơn giản là tự thưởng cho bản thân một buổi chiều ngọt ngào.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}