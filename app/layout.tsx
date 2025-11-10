import "./css/style.css";
import { LoginModalProvider } from '@/contexts/LoginModalContext';

// import { Inter } from "next/font/google";
import localFont from "next/font/local";
// 本地可变字重 Inter
// const inter = localFont({
//   // src: './fonts/Inter-Variable.woff2',
//   display: 'swap',
//   variable: '--font-inter',   // 方便 Tailwind 或 CSS 变量使用
// });
import Header from "@/components/ui/header";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });


export const metadata = {
  title: "斗仙",
  description: "斗仙",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`bg-gray-950 font-inter text-base text-gray-200 antialiased`}
      >
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {/* <Header /> */}
          <LoginModalProvider>
          {children}
        </LoginModalProvider>
        </div>
      </body>
    </html>
  );
}
