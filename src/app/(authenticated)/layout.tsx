"use client"

import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { APP_ROUTES } from "@/lib/constants";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  
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
    <div className="flex">
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
