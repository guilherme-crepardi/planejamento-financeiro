"use client";

import { FinanceProvider } from "@/lib/finance-context";
import { Sidebar } from "@/components/Sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FinanceProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </FinanceProvider>
  );
}
