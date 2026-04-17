'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/src/components/layout/Navbar";
import AdminNavbar from "@/src/components/AdminNavbar";

export default function LayoutNavbar() {
  const pathname = usePathname();
  
  const isAdminPage = pathname.startsWith('/admin');

  return isAdminPage ? <AdminNavbar /> : <Navbar />;
}