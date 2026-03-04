import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/tanstack/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modals/modal-providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Clyra - AI Contract Analysis",
  description:
    "Harness the power of AI to analyze, understand, and optimize your contracts. Identify risks, opportunities, and negotiation points in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ModalProvider>{children}</ModalProvider>
          <Toaster />
        </ReactQueryProvider>
        <script
          src="https://omnix-widget.vercel.app/widget.js"
          data-organization-id="jh7d1vg9e55xtmc7dykg23dn8h827ak2"
          defer
        />
      </body>
    </html>
  );
}
