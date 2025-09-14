import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { FloatingWhatsApp } from "@/components/ui/floating-whatsapp";
import { FloatingSocial } from "@/components/ui/floating-social";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "F&W - Premium Luxury Timepieces",
  description: "Discover F&W's exclusive collection of luxury watches from the world's most prestigious brands. Swiss craftsmanship, exceptional quality, timeless elegance.",
  keywords: "F&W, luxury watches, swiss watches, rolex, omega, tag heuer, premium timepieces, authentic watches",
  openGraph: {
    title: "F&W - Premium Luxury Timepieces",
    description: "Discover F&W's exclusive collection of luxury watches from the world's most prestigious brands.",
    url: "https://fw-watches.store",
    siteName: "F&W",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "F&W - Premium Luxury Timepieces",
    description: "Discover F&W's exclusive collection of luxury watches from the world's most prestigious brands.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <CartDrawer />
          
          {/* Floating Action Buttons */}
          <FloatingWhatsApp 
            phoneNumber="972123456789"
            message="Hello! I'm interested in your luxury watches. Can you help me find the perfect timepiece?"
          />
          
          <FloatingSocial 
            socialLinks={[
              {
                platform: 'instagram',
                url: 'https://instagram.com/luxurywatchstore'
              },
              {
                platform: 'facebook', 
                url: 'https://facebook.com/luxurywatchstore'
              },
              {
                platform: 'tiktok',
                url: 'https://tiktok.com/@luxurywatchstore'
              }
            ]}
          />
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#eab308',
                  secondary: '#000',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
