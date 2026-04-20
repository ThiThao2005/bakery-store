"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Dùng Link để chuyển trang nhanh

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Việt hóa lỗi cho thân thiện với khách hàng
      setError("Email hoặc mật khẩu không chính xác.");
      return;
    }

    router.push("/");
    router.refresh(); // Làm mới dữ liệu auth trên toàn hệ thống
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdf2f4]/30 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl shadow-pink-100 border border-pink-50">
        
        {/* Header Login */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-800">Chào bạn quay lại!</h1>
          <p className="text-gray-500 mt-2 font-medium">Đăng nhập để tiếp tục đặt bánh nhé 🍰</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 text-center font-medium animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-all shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-all shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-pink-500 text-white p-4 rounded-2xl font-black shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-wider"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : "Đăng nhập ngay"}
          </button>
        </form>

        <div className="text-center mt-8 space-y-2">
          <p className="text-gray-500 text-sm font-medium">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-pink-600 font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
          <Link href="/" className="inline-block text-xs text-gray-400 hover:text-pink-500 transition-colors">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}