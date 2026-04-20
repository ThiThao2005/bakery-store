import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bakery Store - Tươi mới mỗi ngày',
  description: 'Cửa hàng bánh ngọt hiện đại, đặt hàng nhanh chóng',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="vi" 
      className="scroll-smooth" 
      // 1. Khắc phục lỗi Hydration do Browser Extension tự ý chèn class/attribute
      suppressHydrationWarning
      // 2. Tối ưu scroll behavior cho Next.js route transitions
      data-scroll-behavior="smooth"
    >
      <body className={`${inter.className} bg-white antialiased`}>
        {/* Bao bọc toàn bộ ứng dụng bằng CartProvider để quản lý giỏ hàng xuyên suốt */}
        <CartProvider>
          {/* Navbar hiển thị ở mọi trang */}
          <Navbar />
          
          <main className="min-h-screen">
            {children}
          </main>

          {/* Bạn có thể thêm Footer ở đây sau này */}
          <footer className="bg-gray-50 py-8 border-t border-gray-100">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Bakery Store. Tươi mới mỗi ngày.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}