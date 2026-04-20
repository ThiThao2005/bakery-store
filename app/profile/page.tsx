"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserAndOrders = async () => {
      setLoading(true);
      
      // 1. Lấy thông tin user hiện tại
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login"); // Nếu chưa login thì đá về trang login
        return;
      }

      setUser(session.user);

      // 2. Lấy lịch sử đơn hàng của user này
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            price_at_time,
            products (name)
          )
        `)
        .eq("customer_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setOrders(ordersData || []);
      }
      
      setLoading(false);
    };

    getUserAndOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf2f4]/30 py-12 px-6 lg:px-20">
      <div className="mx-auto max-w-4xl">
        
        {/* Header Profile */}
        <div className="mb-10 flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-pink-50">
          <div className="h-24 w-24 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 text-4xl font-black">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Chào bạn yêu bánh!</h1>
            <p className="text-gray-500 font-medium">{user?.email}</p>
            <button 
              onClick={() => { supabase.auth.signOut(); router.push("/"); }}
              className="mt-3 text-sm font-bold text-pink-600 hover:text-pink-700 transition-colors"
            >
              Đăng xuất tài khoản
            </button>
          </div>
        </div>

        {/* Lịch sử đơn hàng */}
        <h2 className="mb-6 text-2xl font-black text-gray-800 flex items-center gap-2">
          <i className="fas fa-history text-pink-500"></i> Lịch sử đặt hàng
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-[2.5rem] border border-dashed border-pink-200">
            <p className="text-gray-400 font-medium italic">Bạn chưa có đơn hàng nào. Đi mua bánh ngay nhé!</p>
            <Link href="/shop" className="mt-4 inline-block bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-pink-100">
              Đến Shop ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="bg-gray-50/50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                  <div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Mã đơn hàng</span>
                    <p className="font-black text-gray-800">{order.order_code}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                    order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {order.status === 'pending' ? 'Đang xử lý' : 
                     order.status === 'shipping' ? 'Đang giao' : 
                     order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                  </span>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.order_items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-md bg-pink-50 text-pink-500 flex items-center justify-center text-[10px] font-bold">
                            {item.quantity}x
                          </span>
                          <span className="font-bold text-gray-700">{item.products?.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-400">
                          ${(item.price_at_time * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-dashed border-gray-100 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Ngày đặt</p>
                      <p className="text-sm font-bold text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Tổng thanh toán</p>
                      <p className="text-2xl font-black text-pink-600">${order.total_price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}