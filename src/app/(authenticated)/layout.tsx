"use client";

import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_ROUTES } from "@/lib/constants";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import { MobileNav } from "@/components/mobile-nav";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push(APP_ROUTES.LOGIN);
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />

      {/* Mobile Navigation */}
      <MobileNav onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile, shown on desktop */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0 md:ml-0 transition-all duration-300md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
