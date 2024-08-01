// src/context/TimerContext.tsx
"use client";
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { timerState, startTimerSelector, extendTimerSelector, updateTimerSelector } from "@/store";
import { useAuth } from "@/context/AuthContext";

interface TimerContextType {
  timer: number;
  extendTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, logout } = useAuth();

  const timer = useRecoilValue(timerState);
  const startTimer = useSetRecoilState(startTimerSelector);
  const setExtendTimer = useSetRecoilState(extendTimerSelector);
  const updateTimer = useSetRecoilState(updateTimerSelector);

  const extendTimer = () => {
    setExtendTimer((currentTimer) => currentTimer + 300); // Extend by another 5 minutes
  };

  useEffect(() => {
    if (isLoggedIn) {
      const storedTimer = localStorage.getItem("timer");
      const storedTimestamp = localStorage.getItem("timestamp");

      if (storedTimer && storedTimestamp) {
        const elapsedTime = Math.floor(
          (Date.now() - parseInt(storedTimestamp, 10)) / 1000
        );
        const remainingTime = parseInt(storedTimer, 10) - elapsedTime;

        if (remainingTime > 0) {
          updateTimer(() => remainingTime);
        } else {
          logout(); // Log out if the remaining time is zero or less
          console.log("Timer expired, logging out");
        }
      } else {
        startTimer(7200); // Start the timer with an initial value of 2 hours (7200 seconds)
      }
    }
  }, [isLoggedIn, startTimer, updateTimer, logout]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isLoggedIn && timer > 0) {
      countdown = setInterval(() => {
        updateTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          if (newTimer <= 0) {
            logout(); // Log out when timer reaches 0
            clearInterval(countdown);
            console.log("Timer reached zero, logging out");
            return 0;
          } else {
            localStorage.setItem("timer", newTimer.toString());
            localStorage.setItem("timestamp", Date.now().toString());
            return newTimer;
          }
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isLoggedIn, timer, logout, updateTimer]);

  return (
    <TimerContext.Provider value={{ timer, extendTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
