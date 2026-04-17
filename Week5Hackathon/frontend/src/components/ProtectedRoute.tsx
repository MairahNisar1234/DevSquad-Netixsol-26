"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token exists, kick them back to login
      router.push("/auth/login");
    }
  }, [router]);

  return <>{children}</>;
}