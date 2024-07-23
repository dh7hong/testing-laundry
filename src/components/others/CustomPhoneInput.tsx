"use client";
import React from "react";

interface CustomPhoneInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({ id, name, value, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/[^0-9]/g, ""); // Remove all non-numeric characters

    if (inputValue.length > 3 && inputValue.length <= 7) {
      inputValue = `${inputValue.slice(0, 3)}-${inputValue.slice(3)}`;
    } else if (inputValue.length > 7) {
      inputValue = `${inputValue.slice(0, 3)}-${inputValue.slice(3, 7)}-${inputValue.slice(7, 11)}`;
    }

    onChange(inputValue);
  };

  return (
    <input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={handleInputChange}
      placeholder="ex) 010-1234-5678"
      className="border border-line-normal text-body-1-normal rounded-md px-[16px] py-[12px] w-full max-w-[430px] outline-none text-gray-700"
    />
  );
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  if (cleaned.startsWith("010")) {
    return `+82${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith("82")) {
    return `+${cleaned}`;
  }
  return `+82${cleaned}`;
};

export default CustomPhoneInput;
