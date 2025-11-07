import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./layout.client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "dibeli.my.id - Buat Toko Online Gratis dalam 10 Menit",
  description: "Platform toko online terbaik di Indonesia. Lebih dari 1000+ toko sudah menggunakan dibeli.my.id. Buat toko gratis sekarang!",
  keywords: ["toko online", "buat toko online", "ecommerce indonesia", "jualan online", "WhatsApp store"],
  authors: [{ name: "dibeli.my.id" }],
  openGraph: {
    title: "dibeli.my.id - Buat Toko Online Gratis",
    description: "Lebih dari 1000+ toko sudah menggunakan dibeli.my.id",
    url: "https://dibeli.my.id",
    siteName: "dibeli.my.id",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dibeli.my.id - Buat Toko Online Gratis",
    description: "Platform toko online terbaik di Indonesia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
