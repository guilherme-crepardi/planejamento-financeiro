"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { FinanceProvider } from "@/lib/finance-context";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { LoginPage } from "@/components/LoginPage";

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] animate-pulse" />
          <div className="w-32 h-2 rounded-full bg-[var(--bg-tertiary)] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <FinanceProvider>
      <div className="flex min-h-screen bg-[var(--bg-primary)]">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-6 lg:p-8 pt-20 md:pt-8">
          {children}
        </main>
      </div>
    </FinanceProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell>{children}</AppShell>
      </AuthProvider>
    </ThemeProvider>
  );
}
