'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoginSuccessHandler />
    </Suspense>
  );
}

function LoginSuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasRun = useRef(false); // 🔥 prevent double execution

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    console.log("🔁 Callback mounted");

    const token = searchParams.get('token');
    console.log("🔑 Token from URL:", token);

    if (token) {
      console.log("💾 Saving token...");

      localStorage.setItem('access_token', token);

      // 🔥 VERIFY it actually saved
      const saved = localStorage.getItem('access_token');
      console.log("✅ Token in localStorage:", saved);

      // 🔥 small delay ensures storage is ready before redirect
      setTimeout(() => {
        console.log("➡️ Redirecting to dashboard...");
        router.replace('/dashboard'); // ✅ replace instead of push
      }, 100);
    } else {
      console.log("❌ No token → redirect to login");
      router.replace('/auth/login');
    }
  }, [searchParams, router]);

  return <LoadingState />;
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E7E7E3] space-y-4">
      <Loader2 className="animate-spin text-[#0B2447]" size={40} />
      <h2 className="text-xl font-bold text-[#0B2447] animate-pulse">
        Authenticating...
      </h2>
    </div>
  );
}