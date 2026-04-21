import MaterialManagement from '@/src/components/MaterialManagement';

export default function Page() {
  return (
    // ✅ Added padding that scales: p-4 on mobile, p-8 on larger screens
    // ✅ Added w-full and max-w to keep content centered and readable
    <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8 min-h-screen overflow-x-hidden">
      
      {/* Header section with responsive text sizing */}
      <header className="mb-6 md:mb-10 text-[#EA7C69]">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
          Inventory & Materials
        </h1>
        <p className="text-gray-400 text-sm md:text-base mt-1">
          Track stock levels for your recipes
        </p>
      </header>

      {/* Main component wrapper */}
      <main className="w-full">
        <MaterialManagement />
      </main>
      
    </div>
  );
}