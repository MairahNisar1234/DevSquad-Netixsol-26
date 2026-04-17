"use client";

export default function Process() {
  const steps = [
    { title: "Register", desc: "Create an account to start bidding." },
    { title: "Bid", desc: "Place your offer on your favorite car." },
    { title: "Win", desc: "Become the highest bidder and drive home." }
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
      {steps.map((step, i) => (
        <div key={i} className="text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            {i + 1}
          </div>
          <h3 className="text-xl font-bold text-[#1e2b58] mb-2">{step.title}</h3>
          <p className="text-gray-500">{step.desc}</p>
        </div>
      ))}
    </section>
  );
}