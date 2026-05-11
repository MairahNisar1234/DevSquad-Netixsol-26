"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== allowedRole) {
      router.push('/auth/login');
    }
  }, [router, allowedRole]);

  return <>{children}</>;
}