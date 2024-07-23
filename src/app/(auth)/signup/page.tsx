"use client";

import React, { useState, useEffect, useRef } from "react";
import CustomPhoneInput, { formatPhoneNumber } from "@/components/others/CustomPhoneInput"; // Adjust the import path as necessary

export default function SignUp() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Initial timer is 0
  const [verificationSent, setVerificationSent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sendVerification = async (resend = false) => {
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    try {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber,
          resend,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.message}`);
        return;
      }

      const data = await res.json();
      setMessage(data.message);
      if (res.status === 200) {
        setCooldown(true);
        setTimeLeft(180); // Start the timer at 3 minutes
        setVerificationSent(true); // Mark that verification was sent
        setTimeout(() => setCooldown(false), 10000); // 10 second cooldown
      }
    } catch (error: any) {
      setMessage(`Failed to send verification code: ${error.message}`);
    }
  };

  const verifyCode = async () => {
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    const verificationCode = code.join("");

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: verificationCode,
          phoneNumber: formattedPhoneNumber,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.message}`);
        return;
      }

      const data = await res.json();
      setMessage(data.message);
    } catch (error: any) {
      setMessage(`Failed to verify code: ${error.message}`);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to the next input field
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <div className="bg-gray-50 p-6 rounded-lg shadow-md text-black w-full max-w-md">
        <h1 className="text-1xl font-semibold mb-6">
          전화번호로 가입해주세요!
        </h1>
        <div className="mb-4 relative">
          <label className="block text-md font-medium mb-2" htmlFor="phoneNumber">
            전화번호
          </label>
          <div className="relative w-full max-w-[430px]">
            <CustomPhoneInput
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={setPhoneNumber}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
            {timeLeft > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl font-bold text-red-500">
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
          <button
            onClick={() => sendVerification(verificationSent)}
            disabled={cooldown}
            className={`mt-3 w-full py-2 rounded-lg ${
              cooldown
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {verificationSent ? "승인번호 재요청" : "승인번호 요청"}
          </button>
          {cooldown && (
            <p className="mt-2 text-sm text-gray-400">
              승인번호 재요청은 조금만 기다려주세요.
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-md font-medium mb-2">승인번호</label>
          <div className="flex space-x-2 justify-center mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className="w-10 h-12 text-center text-xl rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={`code-${index}`}
                name={`code-${index}`}
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={verifyCode}
            className="py-2 px-6 rounded-lg bg-green-500 text-white hover:bg-green-600"
            style={{ wordBreak: "keep-all" }}
          >
            번호 인증
          </button>
        </div>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
