export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] p-12">
      <h1 className="text-4xl font-bold text-amber-950 mb-2">Welcome, Tea Lover!</h1>
      <p className="text-amber-700 mb-10">Discover your next favorite blend.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Simple Product Card Placeholder */}
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="h-40 bg-amber-100 rounded-xl mb-4"></div>
            <h3 className="font-bold">Golden Assam</h3>
            <p className="text-amber-800 text-sm">€12.00</p>
          </div>
        ))}
      </div>
    </div>
  );
}