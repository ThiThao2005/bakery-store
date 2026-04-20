"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingProduct?: any; // Nếu có dữ liệu thì là Sửa, không có là Thêm
}

export default function ProductModal({ isOpen, onClose, onSave, editingProduct }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image_url: "",
    description: "",
    category: "Cake"
  });
  const [loading, setLoading] = useState(false);

  // Cập nhật dữ liệu vào form khi chọn sửa sản phẩm
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        image_url: editingProduct.image_url,
        description: editingProduct.description || "",
        category: editingProduct.category || "Cake"
      });
    } else {
      setFormData({ name: "", price: 0, image_url: "", description: "", category: "Cake" });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProduct) {
        // Chế độ Cập nhật
        const { error } = await supabase
          .from("products")
          .update(formData)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        // Chế độ Thêm mới
        const { error } = await supabase
          .from("products")
          .insert([formData]);
        if (error) throw error;
      }
      
      onSave(); // Refresh lại danh sách ở trang admin
      onClose(); // Đóng modal
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">
            {editingProduct ? "Chỉnh sửa bánh" : "Thêm bánh mới"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tên bánh</label>
              <input
                type="text"
                required
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-400"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Giá (VNĐ)</label>
              <input
                type="number"
                required
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-400"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Danh mục</label>
              <select
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-400"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Cake">Cake</option>
                <option value="Cupcake">Cupcake</option>
                <option value="Cookie">Cookie</option>
                <option value="Bread">Bread</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">URL Hình ảnh</label>
            <input
              type="text"
              placeholder="https://..."
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-400"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
          </div>

          {formData.image_url && (
            <div className="h-32 w-full relative rounded-2xl overflow-hidden bg-gray-100 border border-dashed border-gray-200">
              <img src={formData.image_url} className="h-full w-full object-contain" alt="Preview" />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mô tả ngắn</label>
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-400 h-20 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-pink-500 text-white p-4 rounded-2xl font-black shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : (editingProduct ? "Cập nhật sản phẩm" : "Thêm vào thực đơn")}
          </button>
        </form>
      </div>
    </div>
  );
}