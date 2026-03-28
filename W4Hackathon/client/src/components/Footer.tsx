import React from 'react';
import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'Home',
    links: [
      { name: 'Categories', path: '/browse' },
      { name: 'Devices', path: '/devices' },
      { name: 'Pricing', path: '/plans' },
      { name: 'FAQ', path: '/support#faq' },
    ],
  },
  {
    title: 'Movies',
    links: [
      { name: 'Genres', path: '/movies?filter=genres' },
      { name: 'Trending', path: '/trending/movies' },
      { name: 'New Release', path: '/movies/new' },
      { name: 'Popular', path: '/movies/popular' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', path: '/contact' },
    ],
  },
  // Added Subscription section back since it was in your previous version
  {
    title: 'Subscription',
    links: [
      { name: 'Plans', path: '/plans' },
      { name: 'Features', path: '/features' },
    ],
  },
];

const SocialIcon = ({ path }: { path: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="20" 
    height="20" 
    fill="currentColor" 
    className="transition-transform group-hover:scale-110"
  >
    <path d={path} />
  </svg>
);

const socialLinks = [
  { 
    name: 'Facebook', 
    url: 'https://facebook.com', // Fixed: Use real URLs
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" 
  },
  { 
    name: 'Twitter', 
    url: 'https://twitter.com', 
    path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" 
  },
  { 
    name: 'Linkedin', 
    url: 'https://linkedin.com', 
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" 
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F0F0F] text-[#999999] border-t border-[#1F1F1F] ">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-white font-bold text-lg tracking-tight uppercase">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {/* Fixed: map through link objects and use link.path */}
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="hover:text-white transition-colors duration-300 text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg tracking-tight uppercase">
              Connect
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank" // Opens in new tab
                  rel="noopener noreferrer"
                  className="group p-3 bg-[#141414] border border-[#1F1F1F] rounded-xl text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                  aria-label={social.name}
                >
                  <SocialIcon path={social.path} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1F1F1F] bg-[#0A0A0A]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-medium">
            &copy; 2026 <span className="text-red-600 font-bold italic">STREAMVIBE</span>. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
            {[
              { name: 'Terms of Use', path: '/terms' },
              { name: 'Privacy Policy', path: '/privacy' },
              { name: 'Cookie Policy', path: '/cookies' }
            ].map((policy) => (
              <Link 
                key={policy.name} 
                to={policy.path} 
                className="hover:text-white transition-colors border-b border-transparent hover:border-red-600 pb-1"
              >
                {policy.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;