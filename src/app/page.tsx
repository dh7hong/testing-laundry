// src/app/page.tsx
"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import BeforeLoginHomePage from "@/app/(public)/beforeLogin/page";
import AfterLoginHomePage from "@/app/(app)/home/page";

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  console.log("HomePage rendered");
  console.log("isLoggedIn:", isLoggedIn);

  return (
    <div>
      {isLoggedIn ? <AfterLoginHomePage /> : <BeforeLoginHomePage />}
    </div>
  );
}
