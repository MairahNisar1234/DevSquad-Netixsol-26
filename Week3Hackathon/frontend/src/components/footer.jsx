export default function Footer() {
  const headingStyle = "text-[16px] font-[500] leading-[24px] tracking-[0.15px] uppercase mb-8 text-[#282828]";
  const linkStyle = "hover:underline cursor-pointer";
  const listContainerStyle = "space-y-2 text-[14px] font-light text-[#282828]";

  return (
    <footer className="bg-[#F2F2F2] px-6 md:px-16 py-16 border-t border-gray-200 font-['Montserrat']">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Collection Container */}
        <div className="flex flex-col text-left">
          <h4 className={headingStyle}>Collections</h4>
          <ul className={listContainerStyle}>
            <li className={linkStyle}>Black teas</li>
            <li className={linkStyle}>Green teas</li>
            <li className={linkStyle}>White teas</li>
            <li className={linkStyle}>Herbal teas</li>
            <li className={linkStyle}>Matcha</li>
            <li className={linkStyle}>Chai</li>
            <li className={linkStyle}>Oolong</li>
            <li className={linkStyle}>Rooibos</li>
            <li className={linkStyle}>Teaware</li>
          </ul>
        </div>

        {/* Learn Container */}
        <div className="flex flex-col text-left">
          <h4 className={headingStyle}>Learn</h4>
          <ul className={listContainerStyle}>
            <li className={linkStyle}>About us</li>
            <li className={linkStyle}>About our teas</li>
            <li className={linkStyle}>Tea academy</li>
          </ul>
        </div>

        {/* Customer Service Container */}
        <div className="flex flex-col text-left">
          <h4 className={headingStyle}>Customer Service</h4>
          <ul className={listContainerStyle}>
            <li className={linkStyle}>Ordering and payment</li>
            <li className={linkStyle}>Delivery</li>
            <li className={linkStyle}>Privacy and policy</li>
            <li className={linkStyle}>Terms & Conditions</li>
          </ul>
        </div>

        {/* Contact Us Container */}
        <div className="flex flex-col text-left">
          <h4 className={headingStyle}>Contact Us</h4>
          <div className="space-y-4 text-[14px] font-light text-[#282828]">
            <div className="flex items-start gap-3 text-left">
              <img src="/location.png" alt="location" className="w-4 h-4 mt-1 object-contain" />
              <p className="leading-relaxed ">
                3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Province Iran
              </p>
            </div>
            <div className="flex items-center gap-3">
              <img src="/mail.png" alt="email" className="w-4 h-4 object-contain" />
              <p>Email: amoopur@gmail.com</p>
            </div>
            <div className="flex items-center gap-3">
              <img src="/call.png" alt="phone" className="w-4 h-4 object-contain" />
              <p>Tel: +98 9173038406</p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bottom Copyright line */}
      <div className="max-w-7xl mx-auto mt-8pt-8 border-t border-[#D9D9D9] text-[11px] text-gray-400 text-center uppercase tracking-[2px]">
        © 2026 FALAHI & CO.. All Rights Reserved.
      </div>
    </footer>
  );
}