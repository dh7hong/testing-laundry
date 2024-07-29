// src/app/layout.tsx
"use client";
import React, { ReactNode, useEffect } from "react";
import Script from "next/script";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { authState } from "@/store";
import { AuthProvider } from "@/context/AuthContext";
import { TimerProvider } from "@/context/TimerContext";
import localFont from "next/font/local";
import "@/app/global.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const InitializeAuthState = () => {
  const setAuthState = useSetRecoilState(authState);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      console.log("Restoring auth state:", storedAuth);  // Add this line
      setAuthState(JSON.parse(storedAuth));
    }
  }, [setAuthState]);

  return null;
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
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
        <RecoilRoot>
          <InitializeAuthState />
          <AuthProvider>
            <TimerProvider>
              {children}
            </TimerProvider>
          </AuthProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
