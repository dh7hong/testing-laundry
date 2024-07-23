"use client";
import React, { FC, ReactNode } from "react";
import ChevronRightIcon from "@/assets/icons/main/chevron-right-dark.svg";
import AlertIcon from "@/assets/icons/main/alert.svg";
import { useRouter } from "next/navigation";

type TopNavigationProps = {
	text: string;
	children?: ReactNode;
};

const TopNavigation: FC<TopNavigationProps> = ({
	text,
	children,
}) => {
	const router = useRouter();

	const handleSetInfo = () => {
		router.push("/enterAddress/inputAddress/phoneStart");
	};

	const handlePaymentInfo = () => {
		router.push("/paymentInfo");
	};

	const handleAlertInfo = () => {
		router.push("/alertInfo");
	};

	return (
		<div className="flex items-center justify-between w-full max-w-[430px] py-[16px]">
			<button
				onClick={handleSetInfo}
				className="flex items-center text-label-1-normal font-medium"
			>
				{text}
				<ChevronRightIcon className="ml-1 fill-label-neutral" />
			</button>
			<div className="flex space-x-2">
				<button
					className="w-[53px] h-[28px] rounded-sm  bg-primary-normal text-white text-center text-label-1-normal font-normal"
					onClick={handlePaymentInfo}
				>
					가격표
				</button>
				<button
					className="text-label-1-normal font-medium"
					onClick={handleAlertInfo}
				>
					<AlertIcon />
				</button>
			</div>
		</div>
	);
};

export default TopNavigation;
