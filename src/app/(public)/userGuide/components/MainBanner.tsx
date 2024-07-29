"use client";

import React from "react";
import Image from "next/image";
import LA_LOGO from "@/assets/icons/main/la_logo.svg";

import DownArrow from "@/assets/icons/userGuide/doubledown.svg";

const MainBanner = () => {
	return (
		<section className=" relative w-full h-[34rem] overflow-hidden ">
			<Image
				src="/assets/images/userGuide/userGuideMain.jpeg"
				alt="main-banner"
				width={400}
				height={400}
				style={{ objectFit: "fill" }}
			/>
			<div className="absolute top-0 left-0 w-full h-full bg-userGuide z-10 flex justify-center items-center text-center">
				<div className="flex flex-col text-static-white text-2xl items-center ">
					<p>
						코인세탁소 <br />
						빨래 배달 서비스
					</p>
					<div className="flex items-center py-6 mt-12">
						<LA_LOGO className="" />
						<span className="">세탁</span>
					</div>
					<DownArrow className=" w-6 h-6" />
				</div>
			</div>
		</section>
	);
};

export default MainBanner;
