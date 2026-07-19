"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { FinanceProvider } from "@/lib/finance-context";
import { SidebarProvider } from "@/lib/sidebar-context";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { LoginPage } from "@/components/LoginPage";

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl animate-pulse" style={{ background: "linear-gradient(135deg, var(--accent-gradient-start), var(--accent-gradient-end))" }} />
          <div className="w-32 h-2.5 rounded-full animate-pulse" style={{ background: "var(--bg-inset)" }} />
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <FinanceProvider>
      <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
        <Sidebar />
        <main className="flex-1 min-h-screen">
          <div className="p-6 md:p-10 lg:p-12 pt-20 md:pt-10 max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </FinanceProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <AppShell>{children}</AppShell>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
