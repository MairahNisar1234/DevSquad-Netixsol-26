'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('❌ Payment cancelled by user');
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>❌ Payment Cancelled</h1>

        <p style={styles.text}>
          Your payment was not completed. No amount has been charged.
        </p>

        <p style={styles.subtext}>
          You can try again or return to your cart to complete your order.
        </p>

        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryBtn}
            onClick={() => router.push('/cart')}
          >
            🔁 Go to Cart
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => router.push('/')}
          >
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f8f9fa',
    padding: '20px',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    maxWidth: '420px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#dc3545',
  },
  text: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#333',
  },
  subtext: {
    fontSize: '14px',
    marginBottom: '25px',
    color: '#666',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  primaryBtn: {
    padding: '10px 16px',
    background: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '10px 16px',
    background: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};