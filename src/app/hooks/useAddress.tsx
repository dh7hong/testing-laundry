"use client";
import { useState, useEffect } from "react";
import { getInputAddress } from "@/utils/api";

interface Address {
  shippingName: string;
  receiverName: string;
  phoneNumber: string;
  selectedAddress: string;
  detailedAddress: string;
  entryMethod: string;
  entryInput: string;
  carrierOption: string;
  carrierInput: string;
}

const useAddress = (id: string | null) => {
  const [address, setAddress] = useState<Address>({
    shippingName: "",
    receiverName: "",
    phoneNumber: "",
    selectedAddress: "",
    detailedAddress: "",
    entryMethod: "",
    entryInput: "",
    carrierOption: "",
    carrierInput: "",
  });

  const safeJSONParse = (value: string) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };

  useEffect(() => {
    const fetchAddress = async (id: string) => {
      try {
        const data = await getInputAddress(id);
        console.log("Fetched address info in useAddress:", data);

        const savedShippingName = safeJSONParse(localStorage.getItem("shippingName") || data.shippingName);
        const savedReceiverName = safeJSONParse(localStorage.getItem("receiverName") || data.receiverName);
        const savedAddress = safeJSONParse(localStorage.getItem("selectedAddress") || data.selectedAddress);
        const savedDetailedAddress = safeJSONParse(localStorage.getItem("detailedAddress") || data.detailedAddress);
        const savedEntryMethod = safeJSONParse(localStorage.getItem("entryMethod") || data.entryMethod);
        const savedEntryInput = safeJSONParse(localStorage.getItem("entryInput") || data.entryInput);
        const savedCarrierOption = safeJSONParse(localStorage.getItem("carrierOption") || data.carrierOption);
        const savedCarrierInput = safeJSONParse(localStorage.getItem("carrierInput") || data.carrierInput);
        const savedPhoneNumber = safeJSONParse(localStorage.getItem("phoneNumber") || data.phoneNumber);

        setAddress({
          ...data,
          shippingName: savedShippingName,
          receiverName: savedReceiverName,
          selectedAddress: savedAddress,
          detailedAddress: savedDetailedAddress,
          entryMethod: savedEntryMethod,
          entryInput: savedEntryInput,
          carrierOption: savedCarrierOption,
          carrierInput: savedCarrierInput,
          phoneNumber: savedPhoneNumber,
        });
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    if (id) {
      fetchAddress(id);
    }
  }, [id]);

  return { address, setAddress };
};

export default useAddress;
