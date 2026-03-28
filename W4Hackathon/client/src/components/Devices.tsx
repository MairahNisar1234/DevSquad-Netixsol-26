import React from 'react';

const deviceData = [
  {
    title: 'Smartphones',
    desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#E50914]" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    )
  },
  {
    title: 'Tablet',
    desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#E50914]" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    )
  },
  {
    title: 'Smart TV',
    desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#E50914]" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="15" rx="2" ry="2"></rect>
        <line x1="10" y1="21" x2="14" y2="21"></line>
        <line x1="12" y1="18" x2="12" y2="21"></line>
      </svg>
    )
  },
  {
    title: 'Laptops',
    desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#E50914]" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="2" y1="20" x2="22" y2="20"></line>
      </svg>
    )
  },
  {
    title: 'Gaming Consoles',
    desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#E50914]" stroke="currentColor" strokeWidth="2">
        <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"></path>
        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
      </svg>
    )
  },
  {
    title: 'VR Headsets',
    desc: 'StreamVibe is optimized for both Android and iOS smartphones. Download our app from the Google Play Store or the Apple App Store',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#E50914]" stroke="currentColor" strokeWidth="2">
        <path d="M21 9H3m18 0a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2m18 0V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"></path>
        <circle cx="8" cy="13" r="1"></circle>
        <circle cx="16" cy="13" r="1"></circle>
      </svg>
    )
  }
];

const Devices: React.FC = () => {
  return (
    <section className="bg-[#141414] px-6 md:px-16 py-12 md:py-20">
      
      {/* 1. THE HEADING AND DESCRIPTION SECTION */}
      <div className="mb-10 md:mb-16">
        <h2 className="text-white text-2xl md:text-4xl font-bold mb-4">
          We Provide you streaming experience across various devices.
        </h2>
        <p className="text-[#999999] text-sm md:text-base max-w-5xl leading-relaxed">
          With StreamVibe, you can enjoy your favorite movies and TV shows anytime, anywhere. 
          Our platform is designed to be compatible with a wide range of devices, ensuring that 
          you never miss a moment of entertainment.
        </p>
      </div>

      {/* 2. THE GRID OF DEVICE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
        {deviceData.map((device, index) => (
          <div 
            key={index} 
            className="group relative bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border border-[#262626] p-8 md:p-12 rounded-2xl overflow-hidden hover:border-[#333333] transition-all"
          >
            {/* RED AMBIENT GLOW EFFECT */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#E50914] opacity-[0.03] blur-[60px] group-hover:opacity-[0.08] transition-opacity duration-500" />

            <div className="flex items-center gap-4 mb-6">
              {/* ICON WRAPPER */}
              <div className="p-3 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-center">
                {device.icon}
              </div>
              <h3 className="text-white text-xl md:text-2xl font-bold">{device.title}</h3>
            </div>

            <p className="text-[#999999] text-sm md:text-base leading-relaxed">
              {device.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Devices;