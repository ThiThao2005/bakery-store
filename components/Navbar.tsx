"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import CartModal from '@/components/CartModal'; // Import Modal vào đây

export default function Navbar() {
  const { cart, cartCount } = useCart(); // Lấy cartCount trực tiếp từ Context cho gọn
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false); // State quản lý đóng/mở giỏ hàng

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        setRole(data?.role ?? 'customer');
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setRole(null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-6 py-4 backdrop-blur-md shadow-sm lg:px-20">
        <Link href="/" className="text-2xl font-extrabold text-pink-600 tracking-tighter">
          BAKERY
        </Link>

        <nav className="hidden space-x-8 md:flex">
          <Link href="/" className="font-medium hover:text-pink-500 transition">Home</Link>
          <Link href="/shop" className="font-medium hover:text-pink-500 transition">Shop</Link>
          <Link href="/about" className="font-medium hover:text-pink-500 transition">About</Link>
          
          {(role === 'admin' || role === 'staff') && (
            <Link href="/admin" className="font-bold text-amber-600 hover:text-amber-700">Dashboard</Link>
          )}
        </nav>

        <div className="flex items-center space-x-5 text-gray-700">
          <button className="hover:text-pink-500 transition-colors">
            <i className="fas fa-search text-xl"></i>
          </button>
          
          {/* THAY ĐỔI Ở ĐÂY: Dùng button thay vì Link để mở Modal */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative hover:text-pink-500 transition-transform active:scale-90"
          >
            <i className="fas fa-shopping-cart text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
               <Link href="/profile" className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 hover:bg-pink-50 transition border border-transparent hover:border-pink-200">
                  <i className="fas fa-user-circle text-xl text-pink-500"></i>
                  <span className="text-sm font-semibold hidden sm:block">
                    {user.email?.split('@')[0]}
                  </span>
               </Link>
               <button 
                 onClick={() => supabase.auth.signOut()} 
                 className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider"
               >
                 Out
               </button>
            </div>
          ) : (
            <Link href="/login" className="rounded-full bg-pink-500 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all active:scale-95">
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Render Modal ở đây */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}