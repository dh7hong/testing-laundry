"use client";

import React, {
	FC,
	useState,
	useCallback,
	ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import TopNavigation from "@/app/(public)/crudAddress/components/common/TopNavigation/page";
import SearchActive from "@/app/(public)/enterAddress/components/search/SearchActive/page";
import { ClipLoader } from "react-spinners";
import BasicDivider from "@/app/(public)/crudAddress/components/common/BasicDivider/page";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "@/app/(public)/enterAddress/components/common/ProgressBar/page";

interface SearchResult {
	id: string;
	serviceAvailable: string;
	address: string;
	detail: string;
}

const SearchActivePage: FC = () => {
	const router = useRouter();
	const [query, setQuery] = useState<string>("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [fullResponse, setFullResponse] = useState<
		object | null
	>(null);

	const handleBackNavigation = () => {
		const id = JSON.parse(
			localStorage.getItem("editAddressId") || '""'
		);
		router.push(`/crudAddress/editAddress/${id}`);
	};

	const handleSelect = (address: string) => {
		if (typeof window !== "undefined") {
			localStorage.setItem(
				"selectedAddress",
				JSON.stringify(address)
			);
			console.log(`Saved address: "${address}"`);
			alert(`Saved address: "${address}"`);
		}
		router.push(`/crudAddress/components/DetailedAddress`);
	};

	const debounce = (
		func: (...args: any[]) => void,
		wait: number
	) => {
		let timeout: NodeJS.Timeout;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func(...args), wait);
		};
	};

	const fetchResults = async (keyword: string) => {
		setLoading(true);

		if (keyword.trim() === "") {
			setResults([]);
			setFullResponse(null);
			setLoading(false);
			return;
		}

		try {
			const response = await axios.get(
				`https://dapi.kakao.com/v2/local/search/address.json`,
				{
					params: {
						query: keyword,
						size: 10,
						analyze_type: "similar",
					},
					headers: {
						Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
						"Content-Type": "application/json; charset=utf-8",
					},
				}
			);

			setFullResponse(response.data);
			console.log("Full response:", response.data);

			if (response.data && response.data.documents) {
				setResults(
					response.data.documents.map((doc: any) => {
						const addressName = doc.road_address
							? doc.road_address.address_name
							: doc.address_name;
						const detailAddress = doc.address
							? `${doc.address.region_1depth_name} ${
									doc.address.region_2depth_name
							  } ${doc.address.region_3depth_name} ${
									doc.address.main_address_no
							  }${
									doc.address.sub_address_no
										? "-" + doc.address.sub_address_no
										: ""
							  }`
							: doc.address_name;

						return {
							id: uuidv4(),
							serviceAvailable: "서비스 가능 지역",
							address: addressName,
							detail: detailAddress.trim(),
						};
					})
				);
			}
		} catch (error) {
			console.error("Error fetching addresses:", error);
		}
		setLoading(false);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedFetchResults = useCallback(
		debounce(fetchResults, 300),
		[]
	);

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const keyword = e.target.value;
		setQuery(keyword);
		debouncedFetchResults(keyword);
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
					<SearchActive value={query} onChange={handleSearch} />
				</div>
				{!query ? (
					<>
						<BasicDivider
							className="absolute"
							variant="thick"
							vertical={false}
							width="w-full max-w-[430px]"
						/>
						<div className="self-start ml-[20px] mt-[20px] mb-[20px] text-body-1-normal">
							이렇게 검색해보세요.
						</div>
						<div className="flex flex-col self-start">
							<div className="text-label-1-normal text-label-normal ml-[20px]">
								&nbsp;&nbsp;•&nbsp;&nbsp;도로명 + 건물번호
							</div>
							<div className="text-caption-1 text-label-alternative ml-[42px] mt-[5px]">
								예시) 서빙고로 17
							</div>
							<div className="text-label-1-normal text-label-normal ml-[20px] mt-[10px]">
								&nbsp;&nbsp;•&nbsp;&nbsp;지역명 + 번지
							</div>
							<div className="text-caption-1 text-label-alternative ml-[42px] mt-[5px]">
								예시) 한강로2가 427
							</div>
							<div className="text-label-1-normal text-label-normal ml-[20px] mt-[10px]">
								&nbsp;&nbsp;•&nbsp;&nbsp;건물명(아파트명)
							</div>
							<div className="text-caption-1 text-label-alternative ml-[42px] mt-[5px]">
								예시) 이촌동 코인 세탁소
							</div>
						</div>
					</>
				) : loading ? (
					<div className="flex justify-center items-center w-full h-full">
						<ClipLoader
							color="#00A5A1"
							loading={loading}
							size={35}
						/>
					</div>
				) : (
					results.map((item) => (
						<div
							key={item.id}
							className="self-start py-[10px] cursor-pointer w-full max-w-[430px]"
							onClick={() => handleSelect(item.address)}
						>
							<div className="text-caption-1 font-medium text-primary-strong ml-[24px]">
								{item.serviceAvailable}
							</div>
							<div className="text-label-1-normal mt-[1px] ml-[24px]">
								{item.address}
							</div>
							<div className="flex items-center mt-[2px]">
								<span className="border-[0.5px] px-[4px] py-[2px] text-caption-2 text-label-assistive rounded-[4px] text-center ml-[24px]">
									지번
								</span>
								<div className="text-caption-1 text-label-alternative ml-[5px]">
									{item.detail}
								</div>
							</div>
							<div className="mt-[16px]">
								<BasicDivider
									width="calc(100% - 40px)"
									className="!bg-line-neutral mx-[20px] max-w-[430px]"
									variant="normal"
									vertical={false}
								/>
							</div>
						</div>
					))
				)}
			</div>
			<div className="flex-grow w-full max-w-[430px] bg-static-white"></div>
			{fullResponse && (
				<div className="w-full max-w-[430px] p-4 bg-white mt-4">
					<h3 className="text-lg font-bold mb-2">
						Full Response:
					</h3>
					<pre className="text-sm">
						{JSON.stringify(fullResponse, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
};

export default SearchActivePage;
