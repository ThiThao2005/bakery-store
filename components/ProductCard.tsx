"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    // Ngăn chặn việc bấm nút "Thêm" mà nó nhảy luôn vào trang chi tiết
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    });

    setJustAdded(true);

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setJustAdded(false);
    }, 1000);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
      
      {/* Bọc Link quanh phần hình ảnh và thông tin */}
      <Link href={`/shop/${product.id}`} className="flex flex-col flex-grow">
        <div className="relative h-52 overflow-hidden">
          <img
            src={product.image_url || "/placeholder-cake.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badge phân loại */}
          {product.category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-pink-500 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.category}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
            {product.description || "Hương vị thơm ngon, nguyên liệu tự nhiên."}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-extrabold text-pink-600">
              {product.price.toLocaleString()}đ
            </span>
            
            {/* Nút thêm vào giỏ */}
            <button
              onClick={handleAddToCart}
              className={`text-white p-3 rounded-xl transition-all active:scale-95 shadow-lg relative z-10 ${
                justAdded
                  ? "bg-emerald-500 shadow-emerald-100"
                  : "bg-pink-500 hover:bg-pink-600 shadow-pink-100"
              }`}
              title="Thêm vào giỏ hàng"
            >
              {justAdded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Link>

      {/* Thông báo nổi */}
      <div
        className={`pointer-events-none absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow transition-all duration-300 z-20 ${
          justAdded
            ? "translate-y-0 opacity-100 bg-emerald-500"
            : "-translate-y-2 opacity-0 bg-emerald-500"
        }`}
      >
        Đã thêm vào giỏ
      </div>
    </div>
  );
}