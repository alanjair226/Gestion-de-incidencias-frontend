import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Onfiber Incidencias",
    description: "Incidencias onFiber",
    icons: "https://onfiber.com.mx/Logo.svg"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} mt-36 md:mt-24  antialiased dark:bg-dark-bg dark:text-dark-text-primary bg-white text-black lg:mx-40`}
            >
                {children}
            </body>
        </html>
    );
}
