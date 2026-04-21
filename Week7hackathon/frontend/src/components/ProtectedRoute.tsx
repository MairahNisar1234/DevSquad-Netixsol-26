"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, roleRequired }: { children: React.ReactNode, roleRequired?: string }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (roleRequired && user.role !== roleRequired) {
      router.push('/'); // Kick back to home if role doesn't match
      return;
    }

    setAuthorized(true);
  }, [router, roleRequired]);

  if (!authorized) return null; // Or a loading spinner

  return <>{children}</>;
}