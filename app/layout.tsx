import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollTopButton from "@/components/ScrollTopButton";
import Footer from "@/components/Footer";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: "Slog - Dev_Junior's Tech Blog",
    template: "%s | Slog",
  },
  description: "백엔드 개발자 Dev_Junior의 기술 블로그입니다. Java, Spring, AWS 등을 기록합니다.",
  openGraph: {
    title: "Slog - Dev_Junior's Tech Blog",
    description: "꾸준함의 힘을 믿으며, 배운 것을 기록하고 공유합니다.",
    url: "http://localhost:3000",
    siteName: "Slog",
    locale: "ko_KR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            {children}
            <ScrollTopButton />
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}