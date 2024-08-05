import Head from 'next/head'
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./authProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Audio Player App",
  description: "A modern Next.js audio player application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Head>
          <title>Your App Name</title>
          <meta
            name="description"
            content="Convert Substack articles to audio summaries"
          />
          <meta property="og:title" content="ListenStack" />
          <meta
            property="og:description"
            content="Convert Substack articles to audio summaries"
          />
          <meta property="og:url" content="https://article-to-audio-frontend.vercel.app" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Your App Name" />
          <meta
            name="twitter:description"
            content="Convert Substack articles to audio summaries"
          />
        </Head>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
