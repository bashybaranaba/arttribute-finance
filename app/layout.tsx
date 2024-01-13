import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import { ConnectkitCustomProvider } from "@/components/providers/ConnectKitCustomProvider";

const chakra_petch = Chakra_Petch({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Arttribute Finance",
  description: "Arttribute Finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={chakra_petch.className}>
        <ConnectkitCustomProvider>{children}</ConnectkitCustomProvider>
      </body>
    </html>
  );
}
