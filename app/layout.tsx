import "./globals.css";
import { Merriweather_Sans } from "next/font/google"
import React from "react";

const merriweather = Merriweather_Sans({
    subsets: ['latin'],
    variable: '--font-merriweather'
});

export const metadata = {
    title: "Michael's Website",
    description: "Learn more about Michael Zhang"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={merriweather.className}>
        {children}
      </body>
    </html>
  );
}
