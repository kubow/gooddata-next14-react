import { Inter } from "next/font/google";
import "./globals.css";
import "./gooddata-styles.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next.js with GoodData",
  description: "Next.js with GoodData",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
