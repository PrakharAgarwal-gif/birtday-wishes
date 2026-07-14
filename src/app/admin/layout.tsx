"use client";

import { logoutAdmin } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-inter">
      <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center relative z-20">
        <h1 className="text-xl font-outfit font-bold text-gray-800">BirthdayVerse Admin</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-900 font-semibold px-4 py-2 border border-gray-200 rounded-lg transition-colors hover:bg-gray-50">
          Logout
        </button>
      </header>
      <main className="p-8 max-w-6xl mx-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
