"use client";

import { useState } from 'react';

import {
  useRouter,
  usePathname,
} from 'next/navigation';

import {
  LayoutDashboard,
  FileText,
  LogOut,
  Bell,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';

export default function DashboardLayout({
  children,
  title,
  role,
}: {
  children: React.ReactNode;
  title: string;
  role: string;
}) {
  const router = useRouter();

  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard/teacher',
    },
    {
      label: 'Grading History',
      icon: FileText,
      path: '/dashboard/teacher/history',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-screen w-72
          bg-white/90 backdrop-blur-xl
          border-r border-slate-200
          shadow-xl md:shadow-none
          transform transition-transform duration-300

          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'
          }
        `}
      >
        {/* LOGO */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
              <GraduationCap size={22} />
            </div>

            <div>
              <h2 className="font-black text-xl text-slate-800">
                AI-Grader
              </h2>

              <p className="text-xs text-slate-500">
                Teacher Portal
              </p>
            </div>
          </div>

          {/* CLOSE MOBILE */}
          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="md:hidden text-slate-500"
          >
            <X size={22} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            const active =
              pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => {
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium

                  ${
                    active
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }
                `}
              >
                <Icon size={20} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="md:hidden p-2 rounded-xl hover:bg-slate-100"
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-2xl font-black text-slate-800">
                {title}
              </h1>

              <p className="text-sm text-slate-500">
                Welcome back 👋
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
          

            {/* USER */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold uppercase">
                {role[0]}
              </div>

              <div className="hidden sm:block">
                <p className="font-semibold text-slate-800 capitalize">
                  {role}
                </p>

                <p className="text-xs text-slate-500">
                  AI Grader User
                </p>
              </div>
            </div>

            {/* 🔥 LOGOUT MOVED TO NAVBAR */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition font-semibold"
            >
              <LogOut size={18} />

              <span className="hidden sm:block">
                Logout
              </span>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <section className="flex-1 p-4 md:p-8">
          {children}
        </section>
      </main>
    </div>
  );
}