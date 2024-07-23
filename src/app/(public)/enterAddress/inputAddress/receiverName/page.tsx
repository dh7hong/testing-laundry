"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import TopNavigation from "@/app/(public)/enterAddress/components/common/TopNavigation/page";
import EnterPlaceholder from "@/app/(public)/enterAddress/components/common/EnterPlaceholder/page";
import ActionButtonGray from "@/app/(public)/enterAddress/components/common/ActionButtonGray/page";
import ActionButton from "@/app/(public)/enterAddress/components/common/ActionButton/page";
import InputStatic from "@/app/(public)/enterAddress/components/common/InputStatic/page";
import ResetButton from "@/app/(public)/enterAddress/components/common/ResetButton/page";
import ProgressBar from "@/app/(public)/enterAddress/components/common/ProgressBar/page";

const ReceiverName: FC = () => {
	const router = useRouter();
	const [isButtonGray, setIsButtonGray] = useState(true);
	const [inputValue, setInputValue] = useState("");
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const [shippingName, setShippingName] = useState("");

	useEffect(() => {
		const savedReceiverName =
			localStorage.getItem("receiverName");
		const savedShippingName =
			localStorage.getItem("shippingName");

		if (savedReceiverName) {
			setInputValue(savedReceiverName);
			setIsButtonGray(false);
		}

		if (savedShippingName) {
			setShippingName(savedShippingName);
		}
	}, []);

	const handleBackNavigation = () => {
		router.push("/enterAddress/inputAddress/shippingName");
	};

	const handleSave = () => {
		if (inputRef.current) {
			const input = inputRef.current.value;
			localStorage.setItem("receiverName", input);
			setInputValue(input);
			setIsButtonGray(false);
			inputRef.current.blur();
		}
	};

	const handleNextNavigation = () => {
		router.push("/enterAddress/inputAddress/searchAddress");
	};

	const handleReceiverNameChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setInputValue(e.target.value);
	};

	const handleReset = () => {
		localStorage.removeItem("receiverName");
		setInputValue("");
		setIsButtonGray(true);
	};

	return (
		<div className="flex flex-col justify-center items-center bg-gray-50 min-h-screen">
			<div className="w-full max-w-[430px] bg-static-white flex flex-col pb-[16px]">
				<ProgressBar progress={25} />
				<TopNavigation
					text="배송지 추가"
					onClick={handleBackNavigation}
				>
					<ResetButton label="초기화" onClick={handleReset} />
				</TopNavigation>
				<div className="mb-[16px]"></div>
				<div className="w-full max-w-[430px] px-[24px]">
					<div className="mb-[8px] text-label-1-normal font-semibold text-label-normal text-left">
						받는 분
					</div>
					{isButtonGray ? (
						<EnterPlaceholder
							id="enterReceiverNameInput"
							placeholder="받는 분 성함을 입력해 주세요"
							value={inputValue}
							onChange={handleReceiverNameChange}
							ref={inputRef}
						/>
					) : (
						<InputStatic value={inputValue} />
					)}
				</div>
			</div>
			<div className="w-full max-w-[430px] px-[24px] bg-static-white">
				<div className="mb-[8px] text-label-1-normal font-semibold text-label-normal text-left">
					배송지 이름
				</div>
				<InputStatic value={shippingName} />
			</div>

			<div className="flex-grow w-full max-w-[430px] bg-static-white"></div>
			<div className="fixed bottom-[0px] w-full max-w-[430px] h-[100px] shadow-elevation-shadow-normal-top z-50">
				{isButtonGray ? (
					<ActionButtonGray
						label="다음"
						onClick={handleSave}
						className="w-full text-primary-normal"
					/>
				) : (
					<ActionButton
						label="다음"
						onClick={handleNextNavigation}
						className="w-full text-primary-normal"
					/>
				)}
			</div>
		</div>
	);
};

export default ReceiverName;
