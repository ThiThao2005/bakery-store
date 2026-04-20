"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Định nghĩa interface dựa trên cấu trúc bảng products trong sơ đồ của bạn
interface CartItem {
  id: number;      // ID từ Supabase (int8)
  name: string;
  price: number;   // numeric
  quantity: number;
  image_url?: string; // Thêm ảnh để hiển thị trong Cart Modal cho đẹp
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Khởi tạo giỏ hàng từ LocalStorage sau khi component mount (Client-side)
  useEffect(() => {
    const savedCart = localStorage.getItem("bakery_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Lưu giỏ hàng mỗi khi có thay đổi
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("bakery_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Thêm sản phẩm (Dùng nguyên object product để linh hoạt)
  const addToCart = (product: CartItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Cập nhật số lượng dựa trên ID
  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  // Xóa sản phẩm khỏi giỏ dựa trên ID
  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Tránh lỗi Hydration bằng cách không render children cho đến khi Client đã sẵn sàng
  if (!isInitialized) {
    return null; // Hoặc một cái Loading Spinner nhẹ nhàng
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      totalPrice, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};