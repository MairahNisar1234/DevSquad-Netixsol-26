import { Montserrat } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/src/store/storeProvider';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body style={{ background: '#020617', position: 'relative', overflowX: 'hidden' }}>
        
        <StoreProvider>

          {/* 🌌 GLOBAL BACKGROUND GLOW */}
          <div
            style={{
              position: 'fixed',
              top: '-10%',
              left: '-10%',
              width: '60vw',
              height: '60vw',
              background: 'radial-gradient(circle, rgba(46,213,115,0.18), transparent 70%)',
              filter: 'blur(120px)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: '40%',
              right: '-10%',
              width: '50vw',
              height: '50vw',
              background: 'radial-gradient(circle, rgba(46,213,115,0.12), transparent 70%)',
              filter: 'blur(120px)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          {/* 🧠 CONTENT ABOVE GLOW */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {children}
          </div>

        </StoreProvider>
      </body>
    </html>
  );
}