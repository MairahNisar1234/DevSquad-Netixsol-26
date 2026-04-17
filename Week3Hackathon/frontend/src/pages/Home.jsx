import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import Collections from '../components/collections';
import Hero from '../components/hero';
import { useNavigate } from 'react-router-dom';



export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      <Hero />

     

{/* Features Bar (The icons beside the text) */}
<div className="bg-[#F2F2F2] border-t border-b border-gray-200">
  <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center py-14 px-16 gap-y-8">
    
    {/* Feature 1 */}
    <div className="flex items-center gap-4">
      <img src="/local_cafe.png" alt="Tea" className="w-6 h-6 object-contain" />
      <span className="text-[11px] font-[600] uppercase tracking-[2.5px] text-[#000000] leading-none">
        450+ Kind of Loose Tea
      </span>
    </div>

    {/* Feature 2 */}
    <div className="flex items-center gap-4">
      <img src="/redeem (1).png" alt="Organic" className="w-6 h-6 object-contain" />
      <span className="text-[11px] font-[600] uppercase tracking-[2.5px] text-[#000000] leading-none">
        Certificated Organic Teas
      </span>
    </div>

    {/* Feature 3 */}
    <div className="flex items-center gap-4">
      <img src="/local_shipping.png" alt="Delivery" className="w-6 h-6 object-contain" />
      <span className="text-[11px] font-[600] uppercase tracking-[2.5px] text-[#000000] leading-none">
        Free Delivery
      </span>
    </div>

    {/* Feature 4 */}
    <div className="flex items-center gap-4">
      <img src="/sell.png" alt="Sample" className="w-6 h-6 object-contain" />
      <span className="text-[11px] font-[600] uppercase tracking-[2.5px] text-[#000000] leading-none">
        Sample for all Teas
      </span>
    </div>

  </div>

  {/* Button Section */}
  <div className="flex justify-center items-center pb-16">
    <button className="border border-[#000000] bg-transparent px-10 py-4 text-[13px] font-[600] uppercase tracking-[0.2em] text-[#000000] hover:bg-[#000000] hover:text-white transition-all duration-400">
      Learn More
    </button>
  </div>
</div>
<Collections />
      <Footer />
    </div>
  );
}