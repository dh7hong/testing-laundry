// src/app/crudAddress/components/CarrierOptions/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import CarrierOption from "@/app/(public)/crudAddress/components/carrier/CarrierOption/page";
import { useRouter } from "next/navigation";
import TopNavigation from "@/app/(public)/crudAddress/components/common/TopNavigation/page";
import ActionButton from "@/app/(public)/crudAddress/components/common/ActionButton/page";
import InputStatic from "@/app/(public)/crudAddress/components/common/InputStatic/page";
import useAddress from "@/app/hooks/useAddress";

const CarrierOptions: React.FC = () => {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);

    const { address, setAddress } = useAddress(id);
    const {
        shippingName,
        receiverName,
        phoneNumber,
        selectedAddress,
        detailedAddress,
        entryMethod,
        entryInput
    } = address;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedId = localStorage.getItem("editAddressId");
            if (storedId) {
                setId(JSON.parse(storedId));
            }
        }
    }, []);

    const handleBackNavigation = () => {
        if (id) {
            router.push(`/crudAddress/editAddress/${id}`);
        }
    };

    const handleNextNavigation = () => {
        router.push(`/crudAddress/editAddress/${id}`); // Adjust the route as needed
    };

    return (
        <div className="flex flex-col items-center bg-gray-50 min-h-screen overflow-hidden">
            <div className="w-full max-w-[430px] bg-white flex flex-col pb-24 overflow-auto">
                <TopNavigation
                    text="배송지 추가"
                    onClick={handleBackNavigation}
                />
                <div className="w-full max-w-[430px] bg-static-white px-[24px] text-body-1-normal font-medium pb-[16px]">
                    <div className="text-label-1-normal font-semibold mt-[10px] mb-[8px]">
                        휴대폰 번호
                    </div>
                    <InputStatic value={phoneNumber} />
                </div>
                <div className="w-full max-w-[430px] bg-static-white px-[24px] text-body-1-normal font-medium pb-[8px]">
                    <div className="text-label-1-normal font-semibold mb-[8px]">
                        배송 받으실 주소
                    </div>
                    <InputStatic value={selectedAddress} />
                </div>
                {detailedAddress && (
                    <div className="w-full max-w-[430px] bg-static-white px-[24px] text-body-1-normal font-medium">
                        <div className="text-label-1-normal font-semibold">
                            <InputStatic value={detailedAddress} />
                        </div>
                    </div>
                )}
                <div className="w-full max-w-[430px] bg-static-white px-[24px] text-body-1-normal font-medium pt-[16px]">
                    <div className="text-label-1-normal font-semibold mb-[8px]">
                        공동현관 출입 방법
                    </div>
                    {entryMethod === "공동현관 비밀번호" || entryMethod === "기타" ? (
                        <InputStatic value={entryInput} />
                    ) : (
                        <InputStatic value={entryMethod} />
                    )}
                </div>
                <div className="mx-[24px]">
                    <CarrierOption />
                </div>
                <div className="w-full max-w-[430px] bg-static-white px-[24px] text-body-1-normal font-medium pb-[16px]">
                    <div className="text-label-1-normal font-semibold mb-[8px]">
                        받는 분
                    </div>
                    <InputStatic value={receiverName} />
                </div>
                <div className="w-full max-w-[430px] bg-static-white px-[24px] text-body-1-normal font-medium">
                    <div className="text-label-1-normal font-semibold mb-[8px]">
                        배송지 이름
                    </div>
                    <InputStatic value={shippingName} />
                </div>
            </div>
            <div className="flex-grow w-full max-w-[430px] bg-static-white"></div>
            <div className="fixed bottom-0 w-full max-w-[430px] h-[100px] shadow-elevation-shadow-normal-top">
                <ActionButton
                    label="저장"
                    onClick={handleNextNavigation}
                    className="w-full text-primary-normal"
                />
            </div>
        </div>
    );
};

export default CarrierOptions;
