import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/components/ProductCard';

// Ép Next.js fetch dữ liệu mới sau mỗi 60 giây (ISR)
export const revalidate = 60; 

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Lỗi lấy dữ liệu:', error);
    return {
      products: [] as Product[],
      errorMessage: error.message,
    };
  }

  return {
    products: (data ?? []) as Product[],
    errorMessage: null,
  };
}

export default async function ShopPage() {
  const { products, errorMessage } = await getProducts();
  const isEmpty = products.length === 0;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 lg:px-20">
        {/* Header trang Shop */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-gray-800 md:text-5xl">
            Tiệm Bánh Của <span className="text-pink-500">Thảo</span>
          </h1>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-pink-500"></div>
          <p className="mt-4 text-gray-500 font-medium">Khám phá hương vị ngọt ngào trong từng chiếc bánh</p>
        </div>

        {/* Hiển thị lỗi hoặc danh sách */}
        {isEmpty ? (
          <div className="mx-auto max-w-xl rounded-3xl border-2 border-dashed border-pink-100 bg-white p-12 text-center shadow-sm">
            <span className="text-6xl">🧁</span>
            <h2 className="mt-6 text-xl font-bold text-gray-800">Ối! Chưa có bánh nào cả</h2>
            <p className="mt-2 text-gray-500">Shop đang cập nhật thực đơn, bạn quay lại sau nhé!</p>
            
            {errorMessage && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-500 font-mono">
                Error: {errorMessage}
              </div>
            )}
            
            {!errorMessage && (
              <div className="mt-6 text-xs text-gray-400">
                <p>💡 Gợi ý: Kiểm tra RLS Policy "Enable read access for all users" trên bảng products.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}