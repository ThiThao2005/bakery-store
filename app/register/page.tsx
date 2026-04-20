"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu cần tối thiểu 6 ký tự để bảo mật.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(true); // Giữ trạng thái loading nhẹ để user không bấm loạn

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Tạo tài khoản thành công! Hãy kiểm tra hộp thư email để xác nhận.");
    setLoading(false);

    // Chuyển hướng sau 3 giây để khách kịp đọc thông báo
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdf2f4]/30 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl shadow-pink-100 border border-pink-50">
        
        {/* Header Register */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-800">Gia nhập tiệm bánh</h1>
          <p className="text-gray-500 mt-2 font-medium">Tạo tài khoản để nhận nhiều ưu đãi 🍰</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 text-center font-medium animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-600 text-sm p-3 rounded-xl border border-emerald-100 text-center font-medium">
              {success}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
            <input
              type="email"
              placeholder="nhap-email@gmail.com"
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
              placeholder="Tối thiểu 6 ký tự"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-all shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-1">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-all shadow-sm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-pink-500 text-white p-4 rounded-2xl font-black shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-wider"
          >
            {loading ? "Đang xử lý..." : "Đăng ký ngay"}
          </button>
        </form>

        <div className="text-center mt-8 space-y-2">
          <p className="text-gray-500 text-sm font-medium">
            Đã có tài khoản rồi?{" "}
            <Link href="/login" className="text-pink-600 font-bold hover:underline">
              Đăng nhập tại đây
            </Link>
          </p>
          <Link href="/" className="inline-block text-xs text-gray-400 hover:text-pink-500 transition-colors">
            ← Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}