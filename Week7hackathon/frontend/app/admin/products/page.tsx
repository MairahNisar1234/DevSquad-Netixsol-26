import ProductManagement from '@/src/components/ProductManagement';

export default function Page() {
  return (
    
    <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8 min-h-screen overflow-x-hidden">
      
      <header className="mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Product Management
        </h1>
        <p className="text-gray-400 text-sm md:text-base mt-1">
          Manage your menu items and pricing
        </p>
      </header>

     
      <main className="w-full">
        <ProductManagement />
      </main>
      
    </div>
  );
}