// src/components/TopNavigation.tsx
"use client";
import React, { FC, ReactNode } from "react";
import ChevronRightIcon from "@/assets/icons/main/chevron-right-dark.svg";
import AlertIcon from "@/assets/icons/main/alert.svg";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Ensure this path is correct
import { useTimer } from "@/context/TimerContext"; // Ensure this path is correct

type TopNavigationProps = {
  text: string;
  children?: ReactNode;
};

const TopNavigation: FC<TopNavigationProps> = ({ text, children }) => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { timer, extendTimer } = useTimer();

  const handleSetInfo = () => {
    router.push("/enterAddress/inputAddress/phoneStart");
  };

  const handleLogin = () => {
    router.push("/(auth)/signup"); // Route to the signup page within (auth)
  };

  const handleAlertInfo = () => {
    router.push("/alertInfo");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-between w-full max-w-[430px] py-[16px]">
      <button onClick={handleSetInfo} className="flex items-center text-label-1-normal font-medium">
        {text}
        <ChevronRightIcon className="ml-1 fill-label-neutral" />
      </button>
      <div className="flex space-x-2">
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <button className="w-[35px] h-[28px] rounded-sm bg-secondary-normal text-primary-normal text-center text-label-1-normal font-normal">
              {formatTime(timer)}
            </button>
            <div
              className="w-[70px] h-[28px] rounded-sm bg-primary-normal text-white text-center text-label-1-normal font-normal flex items-center justify-center cursor-pointer"
              onClick={extendTimer}
            >
              시간 연장
            </div>
          </div>
        ) : (
          <button
            className="w-[53px] h-[28px] rounded-sm bg-primary-normal text-white text-center text-label-1-normal font-normal cursor-pointer"
            onClick={handleLogin}
          >
            로그인
          </button>
        )}
        <button className="text-label-1-normal font-medium" onClick={handleAlertInfo}>
          <AlertIcon />
        </button>
      </div>
    </div>
  );
};

export default TopNavigation;
