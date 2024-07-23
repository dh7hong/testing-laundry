"use client";
import React, { useState, useEffect } from "react";
import DiscountTagIcon from "@/assets/icons/misc/discount-tag.svg";
import DiscountPercentageIcon from "@/assets/icons/misc/discount-percentage.svg";
import Calendar from "@/assets/icons/misc/calendar.svg";
import MapPin from "@/assets/icons/misc/map-pin.svg";
import Truck from "@/assets/icons/misc/truck.svg";
import Package from "@/assets/icons/misc/package.svg";
import WashingMachineIcon from "@/assets/icons/misc/washing-machine.svg";
import Image from "next/image";
import { BasicDivider } from "@/components/ui/BasicDivider";

const DetailedLaundryPage = () => {
		const totalTime = 32 * 60 * 60; // total time in seconds (32 hours)
		const initialRemainingTime = 29 * 60 * 60 + 59 * 60; // remaining time in seconds (29 hours 59 minutes)
	
		const [remainingTime, setRemainingTime] = useState(
			initialRemainingTime
		);
	
		useEffect(() => {
			const interval = setInterval(() => {
				setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
			}, 1000);
	
			return () => clearInterval(interval);
		}, []);
	
		const hours = Math.floor(remainingTime / 3600);
		const minutes = Math.floor((remainingTime % 3600) / 60);
		const seconds = remainingTime % 60;
		const progressPercentage = (remainingTime / totalTime) * 100;
	
		let laundromatName = "세탁소이름";
		let distance = `${1.1}km`;
		let totalPeople = 4;
		let currentPeople = 3;
		let peopleLeft = totalPeople - currentPeople;
		let originalPrice = 12000;
		let discountedPrice = 4000;
		let discount = 20;
	
		function commaInNumber(x: number) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	
		return (
			<div className="p-3 bg-white w-[290px] h-auto rounded-md border relative mb-[20px]">
				{/* Top Section */}
				<div className="flex justify-between items-center">
					<div className="mr-[8px]">
						<div className="flex items-center bg-[#FFFBE6] p-1 mx-2 rounded-full">
							<DiscountTagIcon className="w-4 h-4" />
							<span className="text-primary-normal font-semibold ml-1 text-caption-2">
								세탁+건조{" "}
								<span className="text-label-alternative line-through">
									{commaInNumber(originalPrice)}
								</span>
								<span className="text-[#F5222D] text-label-2 font-semibold">
									{" "}
									{commaInNumber(discountedPrice)}원
								</span>
							</span>
						</div>
					</div>
					<div
						className="flex items-center bg-[#FFFBE6] p-1 px-2 rounded-full"
						style={{ marginLeft: "-40px" }}
					>
						<span className="text-primary-normal font-semibold text-caption-2">
							배송비
						</span>
						<span className="text-red-500 text-label-2 font-semibold ml-1">
							{discount}%↓
						</span>
					</div>
				</div>
	
				{/* Main Content Area */}
				<div className="p-3 rounded-md text-[#878A93]">
					<div className="flex items-center mb-2">
						<span className="font-semibold text-black text-headline-2 mr-1">
							{laundromatName}
						</span>
						<span className="text-sm ml-1">{distance}</span>
					</div>
					<BasicDivider
						className="!bg-line-neutral mx-auto w-full"
						variant="normal"
						vertical={false}
					/>
	
					<div className="flex">
						<div className="text-[#00A5A1] mt-2" style={{ wordBreak: "keep-all" }}>
							<span className="text-[#000000]" >마감까지 </span>
							{peopleLeft}명 남았어요!
						</div>
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center">
								<div className="flex items-center -space-x-2 mr-2">
									<div className="relative z-30">
										<Image
											src="/assets/icons/misc/person-1.png"
											alt="Person 1"
											width={24}
											height={24}
											className="rounded-full border-2 border-white"
										/>
									</div>
									<div className="relative z-20">
										<Image
											src="/assets/icons/misc/person-2.png"
											alt="Person 2"
											width={24}
											height={24}
											className="rounded-full border-2 border-white"
										/>
									</div>
									<div className="relative z-10">
										<Image
											src="/assets/icons/misc/person-3.png"
											alt="Person 3"
											width={24}
											height={24}
											className="rounded-full border-2 border-white"
										/>
									</div>
									<div className="relative z-0">
										<Image
											src="/assets/icons/misc/person-missing.png"
											alt="Person Missing"
											width={24}
											height={24}
											className="rounded-full border-2 border-white"
										/>
									</div>
								</div>
								<span>{currentPeople}/{totalPeople}</span>
							</div>
						</div>
					</div>
					<div className="flex justify-between items-center mt-2">
						<div className="flex items-center w-full justify-between">
							<div className="relative h-1 w-36 rounded-full overflow-hidden bg-gray-200">
								<div
									className="absolute top-0 left-0 h-full bg-primary-normal"
									style={{ width: `${progressPercentage}%` }}
								></div>
							</div>
							<span className="ml-1 text-red-500 text-right text-[12px] font-bold">{`${hours}:${minutes}:${seconds} 남음`}</span>
						</div>
					</div>
				</div>
		</div>
	);
};

export default DetailedLaundryPage;
