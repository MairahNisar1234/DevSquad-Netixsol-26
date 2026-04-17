'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    console.log('Payment Success');
    console.log('Session ID:', sessionId);

    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/orders/verify/${sessionId}`
        );

        const data = await res.json();

        // EXPECTED: backend returns pointsEarned
        setPoints(data.pointsEarned || 0);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div style={{ padding: 40 }}>
      <h1>🎉 Payment Successful</h1>

      {loading ? (
        <p>Verifying payment...</p>
      ) : (
        <>
          <p>Your order has been placed successfully.</p>
          <p>Session ID: {sessionId}</p>

          {/* ⭐ NEW: POINTS DISPLAY */}
          {points !== null && (
            <div style={{ marginTop: 20, padding: 10, background: '#f5f5f5' }}>
              <h3>⭐ Loyalty Points Earned</h3>
              <p>You earned <b>{points}</b> points from this order!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}