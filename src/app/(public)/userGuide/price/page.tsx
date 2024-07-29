"use client";
import React from "react";

import CTAButtonLarge from "@/components/ui/CTAButtonLarge";
import Question from "@/assets/icons/userGuide/question.svg";

const PricePage = ({ isPriceAble }: { isPriceAble: any }) => {
	const distanceList = [
		{ name: "100m 이내", price: "4,000원" },
		{ name: "200m 이내", price: "4,300원" },
		{ name: "300m 이내", price: "4,600원" },
		{ name: "400m 이내", price: "4,900원" },
		{ name: "500m 이내", price: "5,200원" },
		{ name: "600m 이내", price: "5,500원" },
		{ name: "700m 이내", price: "5,800원" },
		{ name: "800m 이내", price: "6,100원" },
		{ name: "1.0km 이내", price: "6,400원" },
		{ name: "1.1km 이내", price: "6,600원" },
		{ name: "1.2km 이내", price: "6,800원" },
		
	];

	const laundryList = [
		{
			name: "특대 표준",
			amount: "39kg",
			desc: "특대",
			price: "6,000원",
		},
		{
			name: "대량 표준",
			amount: "28kg",
			desc: "대량",
			price: "5,000원",
		},
		{
			name: "소량 표준",
			amount: "20kg",
			desc: "소량",
			price: "4,000원",
		},
		{
			name: "신발 세탁",
			amount: "1켤레",
			desc: "신발만",
			price: "3,000원",
		},
		{
			name: "이불 세탁",
			amount: "39kg",
			desc: "이불만",
			price: "5,000원",
		},
		{
			name: "이불 특대",
			amount: "39kg",
			desc: "이불+특대",
			price: "8,000원",
		},
		{
			name: "이불 대량",
			amount: "28kg",
			desc: "이불+대량",
			price: "7,000원",
		},
		{
			name: "이불 소량",
			amount: "20kg",
			desc: "이불+소량",
			price: "6,000원",
		},
	];

	const dryerList = [
		{
			name: "특대 표준",
			amount: "39kg",
			desc: "특대",
			price: "4,500원",
		},
		{
			name: "대량 표준",
			amount: "28kg",
			desc: "대량",
			price: "4,000원",
		},
		{
			name: "소량 표준",
			amount: "20kg",
			desc: "소량",
			price: "3,000원",
		},
		{
			name: "신발 건조",
			amount: "1켤레",
			desc: "신발만",
			price: "3,000원",
		},
		{
			name: "이불 건조",
			amount: "39kg",
			desc: "이불만",
			price: "4,000원",
		},
		{
			name: "이불 특대",
			amount: "39kg",
			desc: "이불+특대",
			price: "6,000원",
		},
		{
			name: "이불 대량",
			amount: "28kg",
			desc: "이불+대량",
			price: "5,000원",
		},
		{
			name: "이불 소량",
			amount: "20kg",
			desc: "이불+소량",
			price: "4,000원",
		},
	];

	return (
		<div>
			{isPriceAble.distance && (
				<div className="mx-5">
					{distanceList.map((list, i) => (
						<div
							key={i}
							className={`flex justify-between py-5 ${
								i !== distanceList.length - 1
									? "border-b border-dashed border-gray-300"
									: ""
							} px-2`}
						>
							<p className="text-label-alternative font-semibold">
								{list.name}
							</p>
							<p className="text-label-normal text-lg font-semibold">
								{list.price}
							</p>
						</div>
					))}
					
					<div className="flex flex-row gap-2 items-center mt-7 bg-background-normal-alternative rounded-t-md p-5 border-b border-dashed border-line-normal-normal">
						<Question />
						<p className="text-label-neutral font-semibold text-sm">
							배송비 측정 기준은 무엇인가요?
						</p>
					</div>
					<div className="flex flex-row gap-2 items-center bg-background-normal-alternative rounded-b-md p-5">
						<p className="text-label-alternative text-xs">
							배송비는 입력된 고객님의{" "}
							<span className="text-primary-normal font-semibold">
								주거 위치
							</span>
							와{" "}
							<span className="text-primary-normal font-semibold">
								세탁소 간의 거리
							</span>
							를 계산하여 측정된 가격입니다
						</p>
					</div>
				</div>
			)}

			{isPriceAble.laundryPrice && (
				<div className="mx-5">
					{laundryList.map((list, i) => (
						<div
							key={i}
							className={`flex justify-between py-5 ${
								i !== laundryList.length - 1
									? "border-b border-dashed border-gray-300"
									: ""
							} px-2`}
						>
							<div className="flex flex-col w-1/4">
								<p className="text-label-alternative font-semibold">
									{list.name}
								</p>
							</div>
							<div className="flex flex-col w-1/4">
								<p className="text-label-normal font-semibold">
									{list.amount}
								</p>
							</div>
							<div className="flex flex-col w-1/4">
								<p className="text-label-normal font-semibold">
									{list.desc}
								</p>
							</div>
							<div className="flex flex-col w-1/4">
								<p className="text-label-normal font-semibold">
									{list.price}
								</p>
							</div>
						</div>
					))}
				</div>
			)}

			{isPriceAble.dryerPrice && (
				<div className="mx-5">
					{dryerList.map((list, i) => (
						<div
							key={i}
							className={`flex justify-between py-5 ${
								i !== laundryList.length - 1
									? "border-b border-dashed border-gray-300"
									: ""
							} px-2`}
						>
							<div className="flex flex-col w-1/4">
								<p className="text-label-alternative font-semibold">
									{list.name}
								</p>
							</div>
							<div className="flex flex-col w-1/4">
								<p className="text-label-normal font-semibold">
									{list.amount}
								</p>
							</div>
							<div className="flex flex-col w-1/4">
								<p className="text-label-normal font-semibold">
									{list.desc}
								</p>
							</div>
							<div className="flex flex-col w-1/4">
								<p className="text-label-normal font-semibold">
									{list.price}
								</p>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="flex justify-center mt-20">
				<CTAButtonLarge
					buttonColor="#13C2C2"
					borderColor="#00C4CC"
					borderThickness="0px"
					buttonText="세탁물 맡기기"
					buttonTextSize="16px"
					buttonTextColor="#FFFFFF"
				/>
			</div>
		</div>
	);
};

export default PricePage;
