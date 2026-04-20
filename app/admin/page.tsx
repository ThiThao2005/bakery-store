"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import ProductModal from "@/components/ProductModal";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [tab, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === "orders") {
        let query = supabase
          .from("orders")
          .select(`
            *,
            order_items (
              quantity,
              price_at_time,
              products (name)
            )
          `)
          .order("created_at", { ascending: false });
        
        if (filterStatus !== "all") {
          query = query.eq("status", filterStatus);
        }

        const { data } = await query;
        setOrders(data || []);
      } else {
        const { data } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán thống kê nhanh
  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + (order.status === 'completed' ? order.total_price : 0), 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalProducts: products.length
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    
    if (!error) fetchData();
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Thảo có chắc muốn xóa bánh này không? Các đơn hàng cũ liên quan có thể bị ảnh hưởng!");
    if (confirmDelete) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) fetchData();
      else alert("Lỗi: Không thể xóa sản phẩm đã có trong đơn hàng.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-6 lg:px-20">
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Doanh thu hoàn tất</p>
          <h2 className="text-3xl font-black text-emerald-500">{stats.totalRevenue.toLocaleString()}đ</h2>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Đơn hàng mới</p>
          <h2 className="text-3xl font-black text-amber-500">{stats.pendingOrders} đơn</h2>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tổng loại bánh</p>
          <h2 className="text-3xl font-black text-pink-500">{stats.totalProducts} loại</h2>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
          <button 
            onClick={() => setTab("orders")}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${tab === "orders" ? "bg-pink-500 text-white shadow-lg shadow-pink-100" : "text-gray-400 hover:text-gray-600"}`}
          >
            Đơn hàng
          </button>
          <button 
            onClick={() => setTab("products")}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all ${tab === "products" ? "bg-pink-500 text-white shadow-lg shadow-pink-100" : "text-gray-400 hover:text-gray-600"}`}
          >
            Sản phẩm
          </button>
        </div>

        {tab === "orders" && (
          <select 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-pink-500 shadow-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="completed">Đã xong</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
        </div>
      ) : tab === "orders" ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-black text-2xl text-gray-800 tracking-tight">{order.order_code}</span>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                    order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                {/* CHI TIẾT MÓN ĂN - QUAN TRỌNG */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Chi tiết bánh:</p>
                   {order.order_items?.map((item: any, i: number) => (
                     <div key={i} className="text-sm font-bold text-gray-700 flex gap-2">
                       <span className="text-pink-500">{item.quantity}x</span> {item.products?.name}
                     </div>
                   ))}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-800">{order.customer_name} • {order.phone}</p>
                  <p className="text-xs text-gray-400">{order.address}</p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between min-w-[200px]">
                <div className="text-right mb-4">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Tổng đơn</p>
                  <p className="font-black text-3xl text-pink-600">{order.total_price.toLocaleString()}đ</p>
                </div>
                
                <select 
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-black outline-none focus:border-pink-500 cursor-pointer transition-all"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Đã xong</option>
                  <option value="cancelled">Hủy đơn</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <button onClick={handleAddNew} className="border-4 border-dashed border-gray-100 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-pink-200 hover:bg-pink-50/20 transition-all group min-h-[350px]">
            <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
               <i className="fas fa-plus text-2xl"></i>
            </div>
            <span className="font-black text-gray-400 uppercase tracking-widest text-xs group-hover:text-pink-500">Thêm bánh mới</span>
          </button>

          {products.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-[3rem] shadow-sm border border-gray-100 relative group hover:shadow-2xl transition-all duration-500">
              <div className="relative h-48 w-full mb-6 overflow-hidden rounded-[2rem]">
                <img src={p.image_url || "/placeholder-cake.jpg"} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <span className="text-[10px] font-black uppercase text-pink-400 tracking-widest">{p.category}</span>
              <h3 className="font-black text-gray-800 text-xl leading-tight mt-1">{p.name}</h3>
              <p className="text-pink-600 font-black text-2xl mt-2">{p.price.toLocaleString()}đ</p>
              
              <div className="absolute top-10 right-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <button onClick={() => handleEdit(p)} className="h-12 w-12 bg-white rounded-full shadow-2xl text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center">
                  <i className="fas fa-pen-nib"></i>
                </button>
                <button onClick={() => handleDelete(p.id)} className="h-12 w-12 bg-white rounded-full shadow-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchData} editingProduct={editingProduct} />
    </div> );
 }