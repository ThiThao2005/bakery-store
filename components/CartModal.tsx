"use client";

import { FormEvent, useState } from "react";
import { useCart } from "@/context/CartContext";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  
  // State quản lý Form
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  
  // State quản lý UI/UX
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          note,
          totalPrice,
          // Map lại dữ liệu để khớp với bảng order_items trong database
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            priceAtTime: item.price, // Lưu giá tại thời điểm mua
          })),
        }),
      });

      const result = (await response.json()) as { error?: string; orderId?: number };

      if (!response.ok) {
        throw new Error(result.error || "Không thể tạo đơn hàng lúc này.");
      }

      // 1. Xóa giỏ hàng sau khi thành công
      clearCart();
      
      // 2. Thông báo thành công
      setMessage({
        type: "success",
        text: `Đặt hàng thành công! Mã đơn của bạn là #${result.orderId}.`,
      });

      // 3. Reset form
      setCustomerName("");
      setPhone("");
      setAddress("");
      setNote("");

      // 4. Đóng modal sau 2 giây để khách kịp đọc thông báo
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2500);

    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt hàng.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black text-gray-800">Giỏ hàng của bạn 🍰</h2>
          <button 
            onClick={onClose} 
            className="text-3xl text-gray-400 hover:text-pink-500 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-5xl">🛒</span>
              <p className="mt-4 text-gray-400 font-medium">Giỏ hàng đang trống...</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-50 py-4">
                <div className="flex flex-col">
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-sm font-semibold text-pink-500">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Bộ tăng giảm số lượng */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 hover:bg-white hover:text-pink-500 transition-all font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-gray-700">
                      {item.quantity}
                    </span>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 hover:bg-white hover:text-pink-500 transition-all font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Nút xóa */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="Xóa sản phẩm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Phần thanh toán & Form */}
        {cart.length > 0 && (
          <form className="mt-6 space-y-3" onSubmit={handleCheckout}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Tổng cộng</span>
              <span className="text-2xl font-black text-pink-600">
                ${totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="text" required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-300 focus:bg-white transition-all"
                placeholder="Họ và tên khách hàng"
              />
              <input
                type="tel" required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-300 focus:bg-white transition-all"
                placeholder="Số điện thoại"
              />
              <input
                type="text" required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-300 focus:bg-white transition-all"
                placeholder="Địa chỉ giao hàng"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px] w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-pink-300 focus:bg-white transition-all"
                placeholder="Ghi chú thêm cho tiệm bánh..."
              />
            </div>

            {/* Thông báo trạng thái */}
            {message && (
              <div className={`animate-shake rounded-xl p-3 text-sm font-bold text-center ${
                message.type === "success" 
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                : "bg-red-50 text-red-600 border border-red-100"
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-pink-500 py-4 font-black text-white shadow-lg shadow-pink-100 hover:bg-pink-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "ĐANG XỬ LÝ ĐƠN..." : "XÁC NHẬN ĐẶT HÀNG"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}