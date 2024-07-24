// src/app/layout.tsx
"use client";
import Script from 'next/script';
import { AuthProvider } from "@/context/AuthContext";
import { RecoilRoot } from "recoil";
import localFont from "next/font/local";
import "@/app/global.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

import React, { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <Script
            src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services,clusterer,drawing&autoload=false`}
            strategy="beforeInteractive"
            onError={() => console.error("Failed to load Kakao Maps script")}
          />
        </head>
        <body className={`${pretendard.className} min-h-screen`}>
          <RecoilRoot>{children}</RecoilRoot>
        </body>
      </html>
    </AuthProvider>
  );
}
