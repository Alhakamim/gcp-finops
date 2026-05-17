import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinOps — GCP Billing Analytics",
  description: "Enterprise Google Cloud Billing & FinOps Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        {children}
      </body>
    </html>
  );
}
