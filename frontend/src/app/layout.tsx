import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PakBooking - Pakistan's Premier Hotel Booking Platform",
  description: "Discover and book the best hotels across Pakistan. Experience luxury accommodations with our cutting-edge booking platform. Secure, fast, and designed for modern travelers.",
  keywords: "Pakistan hotels, hotel booking, accommodation, travel, luxury hotels, booking platform",
  authors: [{ name: "PakBooking Team" }],
  creator: "PakBooking",
  publisher: "PakBooking",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PakBooking - Pakistan's Premier Hotel Booking Platform",
    description: "Discover and book the best hotels across Pakistan. Experience luxury accommodations with our cutting-edge booking platform.",
    url: '/',
    siteName: 'PakBooking',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PakBooking - Hotel Booking Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PakBooking - Pakistan's Premier Hotel Booking Platform",
    description: "Discover and book the best hotels across Pakistan. Experience luxury accommodations with our cutting-edge booking platform.",
    images: ['/og-image.jpg'],
    creator: '@pakbooking',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
                <div className="grid-pattern fixed inset-0 opacity-30" />
                <div className="dot-pattern fixed inset-0 opacity-20" />
                <main className="relative z-10">
                  {children}
                </main>
              </div>
              
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(15, 23, 42, 0.95)',
                    color: '#f1f5f9',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#f1f5f9',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#f1f5f9',
                    },
                  },
                  loading: {
                    iconTheme: {
                      primary: '#0ea5e9',
                      secondary: '#f1f5f9',
                    },
                  },
                }}
              />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
