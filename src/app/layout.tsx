import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppDataProvider } from "@/components/layout/AppDataProvider";
import { BottomNav } from "@/components/layout/BottomNav";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";
import "./globals.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#0b0f0d",
};

export const metadata: Metadata = {
  title: "InShape",
  description: "Personal home workout and biking session tracker",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "InShape",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ServiceWorkerRegistration />
        <AppDataProvider>
          <div className="app-root">
            <main className="app-main">{children}</main>
            <BottomNav />
          </div>
        </AppDataProvider>
      </body>
    </html>
  );
}
