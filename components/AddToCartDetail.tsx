"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function AddToCartDetail({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    });

    // Hiệu ứng feedback cho khách
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleAdd}
        disabled={isAdded}
        className={`w-full md:w-auto px-12 py-4 rounded-full font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
          isAdded
            ? "bg-emerald-500 text-white shadow-emerald-100"
            : "bg-pink-500 text-white shadow-pink-100 hover:bg-pink-600"
        }`}
      >
        {isAdded ? (
          <>
            <i className="fas fa-check-circle"></i>
            ĐÃ THÊM VÀO GIỎ
          </>
        ) : (
          <>
            <i className="fas fa-shopping-basket"></i>
            THÊM VÀO GIỎ HÀNG
          </>
        )}
      </button>
      
      {isAdded && (
        <p className="text-emerald-600 text-sm font-bold animate-bounce text-center md:text-left">
          🍰 Tuyệt vời! Bánh đã nằm trong giỏ.
        </p>
      )}
    </div>
  );
}