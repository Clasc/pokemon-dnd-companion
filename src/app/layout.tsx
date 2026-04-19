import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/shared/Navigation";
import ContentBlocker from "@/components/shared/ContentBlocker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pokémon D&D Companion",
  description:
    "A companion app for managing your Pokémon D&D Trainer and Pokemon Team",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <Navigation />
        <div className="splash-overlay" id="splash-static">
          <div className="splash-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="splash-logo"
            >
              <rect width="64" height="64" rx="12" fill="#1a1a1a"/>
              <text x="8" y="48" fontFamily="Poppins, system-ui, sans-serif" fontSize="44" fontWeight="bold" fill="#EE5D20">P</text>
              <text x="36" y="48" fontFamily="Poppins, system-ui, sans-serif" fontSize="44" fontWeight="bold" fill="#1a1a1a">D</text>
            </svg>
            <h1 className="splash-title">Pokémon D&D</h1>
            <p className="splash-subtitle">Companion</p>
            <div className="splash-spinner" />
          </div>
        </div>
        <ContentBlocker>
          <div className="main-content min-h-screen md:pl-56 pb-20 md:pb-0">{children}</div>
        </ContentBlocker>
      </body>
    </html>
  );
}
