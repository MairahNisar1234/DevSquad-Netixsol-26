import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  discountPercent: number | null;
  category: string;
  picture: { url: string } | null; // Explicitly allow null
}

export default function ProductGrid({ products = [] }: { products: Product[] }) {
  // LOG: Check what data is arriving in the browser console
  console.log('--- BROWSER: ProductGrid Render ---');
  console.log('Total Products:', products.length);
  
  // Find any product missing an image to help you identify it in Hygraph
  const missingImages = products.filter(p => !p.picture || !p.picture.url);
  if (missingImages.length > 0) {
    console.warn('Products missing images:', missingImages.map(p => p.name));
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((product) => (
        <div key={product.id} className="group cursor-pointer">
          <div className="relative aspect-[4/5] bg-[#f6f6f6] overflow-hidden rounded-sm mb-4">
            
            {/* 1. CRITICAL FIX: Use optional chaining and a ternary check */}
            {product.picture?.url ? (
              <Image
                src={product.picture.url}
                alt={product.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              /* Fallback UI: This replaces the "null" crash */
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-200 text-zinc-400 p-4 text-center">
                <span className="text-[10px] font-bold uppercase">No Image Asset</span>
                <span className="text-[8px] mt-1">Check Hygraph Publishing</span>
              </div>
            )}

            {/* 2. SAFE DISCOUNT BADGE: Ensure discountPercent exists and is > 0 */}
            {product.discountPercent !== null && product.discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">
                Sale
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-sm uppercase leading-tight max-w-[80%]">
                {product.name}
              </h3>
              <p className="font-bold text-sm">${product.price}</p>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              {product.category || "Lifestyle"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}