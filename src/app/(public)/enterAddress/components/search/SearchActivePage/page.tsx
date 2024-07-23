"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import TopNavigation from "@/app/(public)/enterAddress/components/common/TopNavigation/page";
import ProgressBar from "@/app/(public)/enterAddress/components/common/ProgressBar/page";
import Image from "next/image";
import InputStatic from "@/app/(public)/enterAddress/components/common/InputStatic/page";
import InputStaticAddress from "@/app/(public)/enterAddress/components/common/InputStaticAddress/page";
import ActionButtonAddress from "@/app/(public)/enterAddress/components/common/ActionButtonAddress/page";

declare global {
	interface Window {
		daum: any;
	}
}

const SearchAddress: FC = () => {
	const router = useRouter();
	const [postcode, setPostcode] = useState("");
	const [address, setAddress] = useState("");
	const [extraAddress, setExtraAddress] = useState("");
	const [detailedAddress, setDetailedAddress] = useState("");
	const [jibunAddress, setJibunAddress] = useState("");
	const wrapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const script = document.createElement("script");
		script.src =
			"//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
		script.async = true;
		document.head.appendChild(script);

		script.onload = () => {
			// Do nothing for now, the script is ready to use
		};

		return () => {
			document.head.removeChild(script);
		};
	}, []);

	useEffect(() => {
		const savedDetailedAddress = localStorage.getItem(
			"detailedAddress"
		);
		if (savedDetailedAddress) {
			setDetailedAddress(savedDetailedAddress);
		}
	}, []);

	const handleBackNavigation = () => {
		router.push("/enterAddress/inputAddress/receiverName");
	};

	const handleComplete = (data: any) => {
		let addr = "";
		let extraAddr = "";
		let jibunAddr = data.jibunAddress; // Get the 지번 address

		if (
			typeof window !== "undefined" &&
			data.userSelectedType === "R"
		) {
			addr = data.roadAddress;
			localStorage.setItem("selectedAddress", addr);
		} else {
			addr = data.jibunAddress;
		}

		if (data.userSelectedType === "R") {
			if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
				extraAddr += data.bname;
			}
			if (data.buildingName !== "" && data.apartment === "Y") {
				extraAddr +=
					extraAddr !== ""
						? ", " + data.buildingName
						: data.buildingName;
			}
			if (extraAddr !== "") {
				extraAddr = " (" + extraAddr + ")";
			}
		}

		setPostcode(data.zonecode);
		setAddress(addr);
		setExtraAddress(extraAddr);
		setJibunAddress(jibunAddr); // Set the 지번 address
		setDetailedAddress("");

		if (wrapRef.current) {
			wrapRef.current.style.display = "none";
		}

		// Focus on the detailed address input
		const detailedAddressInput = document.getElementById(
			"detailedAddress"
		) as HTMLInputElement;
		if (detailedAddressInput) {
			detailedAddressInput.focus();
		}
	};

	const handleSearch = () => {
		if (wrapRef.current) {
			wrapRef.current.style.display = "block";
		}

		new window.daum.Postcode({
			oncomplete: handleComplete,
			onresize: function (size: { height: string }) {
				if (wrapRef.current) {
					wrapRef.current.style.height = size.height + "px";
				}
			},
			width: "100%",
			height: "100%",
		}).embed(wrapRef.current);
	};

	const handleDetailedAddressChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setDetailedAddress(value);
		localStorage.setItem("detailedAddress", value); // Save to local storage
	};

	const handleNextNavigation = () => {
		router.push("/enterAddress/inputAddress/houseEntry");
	};

	return (
		<div className="flex flex-col items-center bg-gray-50 min-h-screen">
			<div className="w-full max-w-[430px] bg-static-white flex flex-col pb-[16px]">
				<ProgressBar progress={37.5} />
				<TopNavigation
					text={`배송지 검색`}
					onClick={handleBackNavigation}
				/>
				<div className="mx-[24px] mt-[16px] mb-[20px]">
					<div className="w-full p-2">
						<div className="text-headline-2 mb-[8px]">
							&nbsp;&nbsp;우편번호
						</div>
						<InputStatic
							type="text"
							id="postcode"
							placeholder="우편번호"
							value={postcode}
							readOnly
						/>
					</div>
					<div className="w-full p-2">
						<div className="text-headline-2 mb-[8px]">
							&nbsp;&nbsp;도로명 주소
						</div>
						<InputStatic
							type="text"
							id="address"
							placeholder="도로명 주소"
							value={address}
							readOnly
						/>
					</div>
					<div className="w-full p-2">
						<div className="text-headline-2 mb-[8px]">
							&nbsp;&nbsp;참고항목
						</div>
						<InputStatic
							type="text"
							id="extraAddress"
							placeholder="참고항목"
							value={extraAddress}
							readOnly
						/>
					</div>
					<div className="w-full p-2">
						<div className="text-headline-2 mb-[8px]">
							&nbsp;&nbsp;지번 주소
						</div>
						<InputStatic
							type="text"
							id="jibunAddress"
							placeholder="지번 주소"
							value={jibunAddress}
							readOnly
						/>
					</div>
					<div className="w-full mb-4 p-2">
						<div className="text-headline-2 mb-[8px]">
							&nbsp;&nbsp;상세 주소
						</div>
						<div className="flex items-center border rounded-md w-full max-w-[430px] h-[48px] px-[16px] py-[12px] text-body-1-reading">
							<input
								type="text"
								id="detailedAddress"
								placeholder="상세 주소 입력"
								value={detailedAddress}
								className="bg-transparent text-body-1-reading text-label-normal font-normal w-full outline-none"
								onChange={handleDetailedAddressChange}
							/>
						</div>
					</div>
					<div className="w-full px-[8px] mb-4">
						<ActionButtonAddress
							label="주소 찾기 (꼭 도로명 주소를 선택)"
							onClick={handleSearch}
						/>
					</div>
					<div className="w-full px-[8px]">
						<ActionButtonAddress
							label="다음"
							onClick={handleNextNavigation}
						/>
					</div>
				</div>
				<div
					ref={wrapRef}
					id="wrap"
					style={{
						display: "none",
						border: "1px solid",
						width: "100% - 40px",
						height: "300px",
						margin: "5px 30px",
						position: "relative",
					}}
				>
					<Image
						width={16}
						height={16}
						src="/assets/icons/misc/close.png"
						id="btnFoldWrap"
						style={{
							cursor: "pointer",
							position: "absolute",
							right: "0px",
							top: "-1px",
							zIndex: 1,
						}}
						onClick={() => {
							if (wrapRef.current) {
								wrapRef.current.style.display = "none";
							}
						}}
						alt="접기 버튼"
					/>
				</div>
			</div>
		</div>
	);
};

export default SearchAddress;
