import type { Metadata } from "next";

import { Montserrat, Poppins } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";

import { Toaster } from "@workspace/ui/components/sonner";

// clerk config
import { ClerkProviderWrapper } from "@marketsquare/clerk-config";

const fontPoppin = Poppins({
  weight: ["100", "200", "400"],
  variable: "--font-poppins",
});

const fontMontserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "400", "500"],
  variable: "--font-Montserrat",
});

export const metadata: Metadata = {
  title: "MarketSquare",
  description: "A multivendor ecommerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontPoppin.variable} ${fontMontserrat.variable} font-sans antialiased `}
        >
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
