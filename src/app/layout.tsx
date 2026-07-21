import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { storeConfig } from "@/data/store";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: `${storeConfig.name} — ${storeConfig.tagline}`,
  description: "Faça seu pedido online. Delivery e retirada.",
  appleWebApp: {
    capable: true,
    title: storeConfig.name,
    statusBarStyle: "default",
  },
  openGraph: {
    title: `${storeConfig.name} — ${storeConfig.tagline}`,
    description: "Faça seu pedido online. Delivery e retirada.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: storeConfig.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <CartProvider>
          <div className="app-shell">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
