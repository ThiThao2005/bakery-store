'use client'
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "Fresh Cupcake", img: "https://recipesbymary.com/wp-content/uploads/2025/08/fresh-strawberry-cupcakes-with-creamy-frosting.png" },
  { name: "Cookies", img: "https://yeutre.vn/cdn/medias/uploads/33/33684-banh-cookies-4.jpg" },
  { name: "Brown Bread", img: "https://i.ytimg.com/vi/j6Lhd8EPx-M/maxresdefault.jpg" },
  { name: "Dark Chocolate", img: "https://cdn.tgdd.vn/Files/2021/09/10/1381788/hoc-ngay-cach-lam-banh-chocolate-mem-xop-khong-can-dung-bot-202109102334444270.jpg" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden bg-[#fdf2f4] px-6 lg:px-20">
        <div className="z-10 max-w-2xl">
          <p className="mb-3 font-bold uppercase tracking-widest text-pink-600">✨ Order Cakes Online</p>
          <h1 className="mb-6 text-6xl font-black leading-[1.1] text-gray-800 lg:text-8xl">
            Upto <span className="text-pink-500">80% Off</span>
          </h1>
          <p className="mb-8 text-lg text-gray-600 max-w-md">
            Thưởng thức hương vị ngọt ngào từ những chiếc bánh tươi mới nhất trong ngày. Đặt ngay để nhận ưu đãi!
          </p>
          <Link href="/shop" className="inline-block rounded-full bg-pink-500 px-12 py-4 font-black text-white shadow-xl shadow-pink-200 transition-all hover:bg-pink-600 hover:shadow-2xl active:scale-95">
            MUA NGAY
          </Link>
        </div>
        
        {/* Hero Image với Next.js Image */}
        <div className="absolute right-[-5%] top-1/2 hidden w-1/2 -translate-y-1/2 lg:block">
          <div className="relative h-[500px] w-[500px]">
             <Image 
              src="https://cdn.tgdd.vn/2021/10/CookRecipe/Avatar/banh-kem-socola-hinh-trai-tim-thumbnail-1.jpg" 
              alt="Hero Cake"
              fill
              className="rounded-full border-[12px] border-white object-cover shadow-2xl transition-all duration-1000 hover:rotate-12"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black text-gray-800">Danh mục bánh</h2>
            <div className="mt-3 h-1.5 w-16 rounded-full bg-pink-500"></div>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 font-bold text-pink-500">
            Xem tất cả <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {categories.map((cat, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl bg-gray-50 p-6 transition-all group-hover:bg-pink-50 group-hover:shadow-xl">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              <p className="text-center text-lg font-bold text-gray-700 group-hover:text-pink-500 transition-colors">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 md:flex-row">
          <div className="relative w-full md:w-1/2">
            <img 
              src="https://cdn.tgdd.vn/2020/09/CookProduct/1260-1200x676-67.jpg" 
              className="rounded-[2.5rem] shadow-2xl transition-transform hover:scale-[1.02]"
              alt="About Bakery"
            />
            {/* Decoration badge */}
            <div className="absolute -bottom-10 -left-10 hidden rounded-3xl bg-amber-400 p-8 shadow-xl md:block">
              <p className="text-4xl font-black text-white">10+</p>
              <p className="text-sm font-bold text-amber-900">Năm kinh nghiệm</p>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <span className="mb-4 inline-block font-black uppercase tracking-[0.2em] text-pink-500">Về chúng tôi</span>
            <h3 className="mb-6 text-5xl font-black leading-tight text-gray-800">Hương vị từ tâm,<br/>Xứng tầm đẳng cấp</h3>
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              Tiệm bánh của chúng tôi không chỉ bán bánh, chúng tôi bán niềm vui. Mỗi chiếc bánh đều được nhào nặn từ những nguyên liệu tươi ngon nhất, bởi đôi bàn tay khéo léo của các nghệ nhân làm bánh tâm huyết.
            </p>
            <Link href="/about" className="inline-block rounded-full border-2 border-pink-500 px-10 py-3 font-black text-pink-500 transition-all hover:bg-pink-500 hover:text-white">
              TÌM HIỂU THÊM
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}