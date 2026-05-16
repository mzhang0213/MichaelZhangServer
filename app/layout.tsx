import "./globals.css";
import { Merriweather_Sans } from "next/font/google"
import React from "react";
import { Analytics } from "@vercel/analytics/react"

const merriweather = Merriweather_Sans({
    subsets: ['latin'],
    variable: '--font-merriweather'
});

export const metadata = {
    title: "Michael's Website",
    description: "Learn more about Michael Zhang",
    icons:{
        icon:"/icons/chillpanda-icon.png"
    }
}

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <title>Michael Zhang</title>
                <Analytics/>
            </head>
            <body className={merriweather.className}>
                {children}
            </body>
        </html>
    );
}
