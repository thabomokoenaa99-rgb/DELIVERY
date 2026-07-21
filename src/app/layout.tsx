import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { LocationProvider } from "@/lib/location";
import { storeConfig } from "@/data/store";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
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
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <LocationProvider>
          <CartProvider>
            <div className="app-shell">{children}</div>
          </CartProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
