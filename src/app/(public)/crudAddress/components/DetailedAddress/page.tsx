"use client";
import React, { FC, useState, useEffect } from "react";
import TopNavigation from "@/app/(public)/crudAddress/components/common/TopNavigation/page";
import { useRouter } from "next/navigation";
import InputStatic from "@/app/(public)/crudAddress/components/common/InputStatic/page";
import ActionButtonGray from "@/app/(public)/crudAddress/components/common/ActionButtonGray/page";
import ActionButton from "@/app/(public)/crudAddress/components/common/ActionButton/page";
import "@/app/global.css";
import EnterPlaceholder from "@/app/(public)/crudAddress/components/common/EnterPlaceholder/page";
import useAddress from "@/app/hooks/useAddress";

const DetailedAddress: FC = () => {
	const router = useRouter();
	const [isButtonGray, setIsButtonGray] = useState(true);
	const [isSaved, setIsSaved] = useState(false);
	const [id, setId] = useState<string | null>(null);

	const { address, setAddress } = useAddress(id);
	const {
		shippingName,
		receiverName,
		selectedAddress,
		detailedAddress,
	} = address;

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedId = localStorage.getItem("editAddressId");
			const storedSelectedAddress = localStorage.getItem(
				"selectedAddress"
			);
			if (storedId) {
				setId(JSON.parse(storedId));
			}
			if (storedSelectedAddress) {
				setAddress((prev) => ({
					...prev,
					selectedAddress: JSON.parse(storedSelectedAddress),
				}));
			}
		}
	}, [setAddress]);

	const handleBackNavigation = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("detailedAddress");
		}
		if (id) {
			router.push(`/crudAddress/editAddress/${id}`);
		}
	};

	const handleDetailedAddressChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setAddress((prev) => ({
			...prev,
			detailedAddress: e.target.value,
		}));
		setIsButtonGray(false);
	};

	const handleSave = () => {
		if (typeof window !== "undefined") {
			localStorage.setItem(
				"detailedAddress",
				JSON.stringify(detailedAddress)
			);
			setIsButtonGray(true);
			setIsSaved(true);
			if (id) {
				router.push(`/crudAddress/editAddress/${id}`);
			}
		}
	};

	return (
		<div className="flex flex-col justify-center items-center bg-gray-50 min-h-screen">
			<div className="w-full max-w-[430px] bg-static-white flex flex-col pb-[16px]">
				<TopNavigation
					text={"배송지 수정"}
					onClick={handleBackNavigation}
				/>
				<div className="self-start ml-[24px] mt-[16px] mb-[8px] text-label-1-normal font-semibold">
					배송 받으실 주소
				</div>
			</div>
			<div className="w-full max-w-[430px] bg-white text-body-1-normal font-medium">
				<div className="mx-[24px]">
					<InputStatic value={selectedAddress} />
				</div>
				<div className="mx-[24px] mb-[16px]">
					{isSaved ? (
						<div className="mt-[8px]">
							<InputStatic value={detailedAddress} />
						</div>
					) : (
						<div className="mt-[8px] mb-[16px]">
							<EnterPlaceholder
								id="detailedAddressInput"
								placeholder="상세 주소 입력"
								className="input-common bg-static-white text-label-normal w-full outline-none px-[16px] py-[12px] border-line-normal"
								value={detailedAddress}
								onChange={handleDetailedAddressChange}
							/>
						</div>
					)}
				</div>
			</div>
			<div className="w-full max-w-[430px] bg-static-white px-[24px] text-body-1-normal font-medium pb-[16px] ">
				<div className="text-label-1-normal font-semibold mb-[8px]">
					배송지 이름
				</div>
				<InputStatic value={shippingName} />
			</div>
			<div className="w-full max-w-[430px] bg-static-white px-[24px] text-body-1-normal font-medium pb-[16px]">
				<div className="text-label-1-normal font-semibold mb-[8px]">
					받는 분
				</div>
				<InputStatic value={receiverName} />
			</div>
			<div className="flex-grow w-full max-w-[430px] bg-static-white"></div>
			<div
				className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[430px] bg-white transition-transform duration-300"
				style={{
					height: "100px",
				}}
			>
				<div className="fixed bottom-0 w-full max-w-[430px] h-[100px] shadow-elevation-shadow-normal-top">
					<ActionButtonGray
						label="저장"
						onClick={handleSave}
						className="w-full text-primary-normal"
					/>
				</div>
			</div>
		</div>
	);
};

export default DetailedAddress;
