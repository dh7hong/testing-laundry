"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import TopNavigation from "@/app/(public)/enterAddress/components/common/TopNavigation/page";
import ActionButton from "@/app/(public)/enterAddress/components/common/ActionButton/page";
import ResetButton from "@/app/(public)/enterAddress/components/common/ResetButton/page";
import ProgressBar from "@/app/(public)/enterAddress/components/common/ProgressBar/page";
import FinalFieldCheck from "@/app/(public)/enterAddress/components/common/FinalFieldCheck/page";
import {
	combineAndSaveData,
	clearSpecificLocalStorageItems,
} from "@/utils/localStorage";
import { saveInputAddress } from "@/utils/api";
import { convertLocalStorageToJson } from "@/utils/convertLocalStorage";
import Toast from "@/components/crudAddress/ToastFinalCheck";

const FinalAddressCheck: FC = () => {
	const router = useRouter();
	const [showToast, setShowToast] = useState<boolean>(false);

	const handleReset = () => {
		if (typeof window !== "undefined") {
			localStorage.clear(); // Clear all items in localStorage
		}
		router.push("/enterAddress/inputAddress/shippingName");
	};

	const handleSave = async () => {
		try {
			convertLocalStorageToJson();
			const combinedData = combineAndSaveData();
			console.log("Sending data:", combinedData); // Log the data being sent
			await saveInputAddress(combinedData);

			console.log("Showing toast message");
			setShowToast(true);

			// Hide toast message after 5 seconds
			setTimeout(() => {
				console.log("Hiding toast message");
				setShowToast(false);
				router.push("/crudAddress/addressList"); // Navigate to the address list page
			}, 5000);

			clearSpecificLocalStorageItems(); // Clear specific items except phoneNumber
			
		} catch (err) {
			console.error("Error in handleSave:", err);
			// Optionally, display an error message to the user here
		}
	};

	const handleBackNavigation = () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("phoneNumber");
		}
		router.push("/enterAddress/inputAddress/phoneEntry");
	};

	return (
		<div className="flex flex-col items-center bg-gray-50 min-h-screen">
			<Toast message="새 배송지가 추가되었습니다." show={showToast} />
			<div className="w-full max-w-[430px] bg-white flex flex-col overflow-auto flex-grow pb-24">
				<ProgressBar progress={100} />
				<TopNavigation
					text="배송지 추가"
					onClick={handleBackNavigation}
				>
					<ResetButton label="초기화" onClick={handleReset} />
				</TopNavigation>
				<div className="mt-[20px] mb-[20px]">
					<FinalFieldCheck />
				</div>
			</div>
			<div className="fixed bottom-0 w-full max-w-[430px] h-[100px] shadow-elevation-shadow-normal-top">
				<ActionButton
					label="저장"
					onClick={handleSave}
					className="w-full text-primary-normal"
				/>
			</div>
		</div>
	);
};

export default FinalAddressCheck;
