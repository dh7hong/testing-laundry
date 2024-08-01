"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopNavigation from "@/app/(public)/crudAddress/components/common/TopNavigation/page";
import DiscountTagIcon from "@/assets/icons/misc/discount-tag.svg";
import { BasicDivider } from "@/components/ui/BasicDivider";
import Image from "next/image";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
	timeUntil3pmState,
	updateTimeUntil3pmSelector,
	calculateTimeUntil3pm,
} from "@/store";

interface Place {
	place_name: string;
	road_address_name: string;
	address_name: string;
	phone: string;
	distance: number;
}

const PlacesList: React.FC = () => {
	const [places, setPlaces] = useState<Place[]>([]);
	const router = useRouter();
	const timeUntil3pm = useRecoilValue(timeUntil3pmState);
	const updateTimeUntil3pm = useSetRecoilState(
		updateTimeUntil3pmSelector
	);

	useEffect(() => {
		const interval = setInterval(() => {
			updateTimeUntil3pm(() => calculateTimeUntil3pm());
		}, 1000);

		return () => clearInterval(interval); // Clean up interval on unmount
	}, [updateTimeUntil3pm]);

	const hours = Math.floor(timeUntil3pm / 3600);
	const minutes = Math.floor((timeUntil3pm % 3600) / 60);
	const seconds = timeUntil3pm % 60;
	const progressPercentage = (timeUntil3pm / 86400) * 100;

	useEffect(() => {
		const storedPlaces = JSON.parse(
			localStorage.getItem("places") || "[]"
		);
		// Sort the places by distance
		const sortedPlaces = storedPlaces.sort(
			(a: Place, b: Place) => a.distance - b.distance
		);
		setPlaces(sortedPlaces);
	}, []);

	const handleBackNavigation = () => {
		router.push("/");
	};

	function commaInNumber(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	let originalPrice = 7000;
	let discountedPrice = 5000;
	let discount = 50;
	let currentPeople = 0;

	return (
		<div>
			<div className="flex flex-col items-center">
				<div className="w-full max-w-[430px] bg-static-white flex flex-col pt-[5px]">
					<TopNavigation
						text="세탁소 목록"
						onClick={handleBackNavigation}
					></TopNavigation>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					padding: "20px",
				}}
			>
				{places.map((place, index) => (
					<div
						key={index}
						style={{
							width: "100%",
							maxWidth: "430px",
							backgroundColor: "rgba(255, 255, 255, 0.9)",
							padding: "10px",
							margin: "10px",
							boxSizing: "border-box",
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
							marginTop: "10px",
						}}
					>
						<div className="ml-[12px] mb-1 text-label-1-normal font-medium text-neutral-70">
							{`서비스 가능 지역`}
						</div>
						<div className="flex items-center">
							<div className="mr-[8px]">
								<div className="flex items-center bg-[#FFFBE6] p-1 px-2 ml-2 rounded-full">
									<DiscountTagIcon className="w-4 h-4" />
									<span className="text-primary-normal font-semibold ml-1 text-caption-2">
										세탁+건조{" "}
										<span className="text-[#F5222D] text-label-2 font-semibold">
											{" "}
											{commaInNumber(discountedPrice)}원+
										</span>
									</span>
								</div>
							</div>
							<div className="flex items-center bg-[#FFFBE6] p-1 px-2 rounded-full">
								<span className="text-primary-normal font-semibold text-caption-2">
									배송비
								</span>
								<span className="text-red-500 text-label-2 font-semibold ml-1">
									{discount}%↓
								</span>
							</div>
						</div>
						<div className="ml-[8px] rounded-md text-[#878A93]">
							<div className="flex flex-col items-left mb-3">
								<span className="font-semibold text-black text-headline-2 ml-1 mt-1">
									{`${place.place_name}`}
								</span>
								<div>
									<span className="text-sm ml-1" style={{ wordBreak: "keep-all" }}>
										{place.distance?.toFixed(0) || 0}m
										&nbsp;|&nbsp; {place.road_address_name}
									</span>
								</div>
								<div>
									<span className="border-[0.3px] px-[5px] py-[1px] text-xs text-label-assistive rounded-[4px] text-center">
										지번
									</span>
									<span className="text-sm ml-1" style={{ wordBreak: "keep-all" }}>
										{place.address_name}
									</span>
								</div>
								{place.phone && (
									<div className="text-xs text-label-alternative mt-[2px]">
										&nbsp;{place.phone}
									</div>
								)}
							</div>
							<BasicDivider
								className="!bg-line-neutral mx-auto w-full"
								variant="normal"
								vertical={false}
							/>

							<div className="flex">
								<div
									className="text-[#00A5A1] mt-2"
									style={{ wordBreak: "keep-all" }}
								>
									<span className="text-[#000000]">
										마감까지{" "}
									</span>
									{4 - currentPeople}명 남았어요!
								</div>
								<div className="flex items-center justify-between mb-2 mt-2 ml-1">
									<div className="flex items-center">
										<div className="flex items-center -space-x-2 mr-2">
											<div className="relative z-30">
												<Image
													src="/assets/icons/misc/person-missing.png"
													alt="Person Missing"
													width={24}
													height={24}
													className="rounded-full border-2 border-white"
												/>
											</div>
											<div className="relative z-20">
												<Image
													src="/assets/icons/misc/person-missing.png"
													alt="Person Missing"
													width={24}
													height={24}
													className="rounded-full border-2 border-white"
												/>
											</div>
											<div className="relative z-10">
												<Image
													src="/assets/icons/misc/person-missing.png"
													alt="Person Missing"
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
										<span>
											{currentPeople}/{4}
										</span>
									</div>
								</div>
							</div>
							<div className="flex justify-between items-center mt-0">
								<div className="flex items-center w-full ">
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
				))}
			</div>
		</div>
	);
};

export default PlacesList;
