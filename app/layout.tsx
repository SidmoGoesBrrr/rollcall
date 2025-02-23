// File path: app/layout.tsx
import HeaderAuth from "@/components/header-auth";
import { EnvVarWarning } from "@/components/env-var-warning";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Stunite - Make friends",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
          <nav className="h-14 sm:h-16 px-4 sm:px-6 md:px-8 flex items-center justify-between max-w-screen-lg mx-auto">
            {/* Left: Logo / Brand */}
            <Link href="/" className="text-lg font-bold">
              Stunite
            </Link>
            {/* Right: Auth Buttons */}
            <HeaderAuth />
          </nav>
        </header>

        {/* Main content offset by header height */}
        <main className="pt-14 sm:pt-16">{children}</main>

        {/* Footer */}
        <footer className="mt-10 py-6 border-t text-center text-sm text-gray-500">
          <p>
            Built for{" "}
            <a
              href="https://www3.cs.stonybrook.edu/~wics/hopperhacks/2025/"
              target="_blank"
              className="font-semibold hover:underline"
              rel="noreferrer"
            >
              Hopper Hacks
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
