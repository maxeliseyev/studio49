import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio49",
  description: "Studio49",
  icons: {
    icon: "/Fav.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
