"use client";

import React, { useEffect, useState } from "react";
import {
	Map,
	MapMarker,
	Circle,
	CustomOverlayMap,
} from "react-kakao-maps-sdk";
import TopNavigation from "@/app/(public)/crudAddress/components/common/TopNavigation/page";
import { useRouter } from "next/navigation";

const MapWithSearch: React.FC = () => {
	const [map, setMap] = useState<any>(null);
	const [selectedPlace, setSelectedPlace] = useState<any>(null);
	const [distance, setDistance] = useState<number | null>(null);
	const [places, setPlaces] = useState<any[]>([]);
	const [selectedAddressGPS, setSelectedAddressGPS] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);

	const router = useRouter();

	const handleBackNavigation = () => {
		router.push("/");
	};

	useEffect(() => {
		const loadKakaoMaps = () => {
			return new Promise((resolve, reject) => {
				const existingScript = document.querySelector(
					`script[src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&reload=false"]`
				);
				if (!existingScript) {
					const script = document.createElement("script");
					script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&reload=false`;
					script.async = true;
					script.onload = () => resolve(window.kakao);
					script.onerror = () =>
						reject(
							new Error("Failed to load Kakao Maps script.")
						);
					document.head.appendChild(script);
				} else {
					resolve(window.kakao);
				}
			});
		};

		const address = localStorage.getItem("selectedAddress");
		if (address) {
			loadKakaoMaps()
				.then((kakao: any) => {
					if (kakao && kakao.maps) {
						const geocoder = new kakao.maps.services.Geocoder();
						geocoder.addressSearch(
							address,
							(
								result: {
									y: any;
									x: any;
								}[],
								status: any
							) => {
								if (status === kakao.maps.services.Status.OK) {
									const coords = new kakao.maps.LatLng(
										result[0].y,
										result[0].x
									);
									setSelectedAddressGPS({
										latitude: coords.getLat(),
										longitude: coords.getLng(),
									});
								} else {
									console.error(
										"Failed to geocode address:",
										status
									);
								}
							}
						);
					}
				})
				.catch((error) => console.error(error.message));
		}
	}, []);

	useEffect(() => {
		if (!selectedAddressGPS && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setSelectedAddressGPS({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				(error) => {
					console.error("Error getting current location", error);
					alert(
						"Error getting current location. Please enable location services and try again."
					);
				},
				{ timeout: 3000 }
			);
		} else if (!navigator.geolocation) {
			alert("Geolocation is not supported by this browser.");
		}
	}, [selectedAddressGPS]);

	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	): number => {
		const R = 6371;
		const dLat = (lat2 - lat1) * (Math.PI / 180);
		const dLon = (lon2 - lon1) * (Math.PI / 180);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * (Math.PI / 180)) *
				Math.cos(lat2 * (Math.PI / 180)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c;
		return distance * 1000;
	};

	useEffect(() => {
		if (selectedPlace && selectedAddressGPS) {
			const distance = calculateDistance(
				selectedAddressGPS.latitude,
				selectedAddressGPS.longitude,
				selectedPlace.y,
				selectedPlace.x
			);
			setDistance(distance);
		}
	}, [selectedPlace, selectedAddressGPS]);

	const handleMarkerClick = (place: any) => {
		setSelectedPlace(place);
		if (selectedAddressGPS) {
			const distance = calculateDistance(
				selectedAddressGPS.latitude,
				selectedAddressGPS.longitude,
				place.y,
				place.x
			);
			setDistance(distance);
		}
	};

	const handleMapClick = () => {
		setSelectedPlace(null);
	};

	useEffect(() => {
		if (map && selectedAddressGPS) {
			const ps = new window.kakao.maps.services.Places();

			ps.keywordSearch(
				"코인 세탁",
				(data: any, status: any) => {
					if (status === window.kakao.maps.services.Status.OK) {
						setPlaces(data);
						const bounds = new window.kakao.maps.LatLngBounds();
						data.forEach((place: any) => {
							bounds.extend(
								new window.kakao.maps.LatLng(place.y, place.x)
							);
						});
						map.setBounds(bounds);
					} else {
						console.error("Failed to search places:", status);
						alert(
							"Failed to search places. Please try again later."
						);
					}
				},
				{
					location: new window.kakao.maps.LatLng(
						selectedAddressGPS.latitude,
						selectedAddressGPS.longitude
					),
					radius: 1200,
				}
			);
		}
	}, [map, selectedAddressGPS]);

	return (
		<div>
			<div className="flex flex-col items-center">
				<div className="w-full max-w-[430px] bg-static-white flex flex-col pt-[5px]">
					<TopNavigation
						text="지도로 세탁소 보기"
						onClick={handleBackNavigation}
					></TopNavigation>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					height: "100vh",
				}}
			>
				{selectedAddressGPS && (
					<Map
						center={{
							lat: selectedAddressGPS.latitude,
							lng: selectedAddressGPS.longitude,
						}}
						style={{
							width: "100%",
							height: "400px",
							maxWidth: "430px",
						}}
						level={5}
						onCreate={setMap}
						onClick={handleMapClick}
					>
						<MapMarker
							position={{
								lat: selectedAddressGPS.latitude,
								lng: selectedAddressGPS.longitude,
							}}
							image={{
								src: "/assets/icons/misc/markerStar.png",
								size: { width: 24, height: 35 },
							}}
							title="Selected Location"
						/>
						<Circle
							center={{
								lat: selectedAddressGPS.latitude,
								lng: selectedAddressGPS.longitude,
							}}
							radius={1200}
							strokeWeight={5}
							strokeColor="#75B8FA"
							strokeOpacity={0.5}
							strokeStyle="dashed"
							fillColor="#CFE7FF"
							fillOpacity={0.5}
						/>
						{places.map((place) => (
							<MapMarker
								key={place.id}
								position={{ lat: place.y, lng: place.x }}
								onClick={() => handleMarkerClick(place)}
							/>
						))}
						{selectedPlace && (
							<CustomOverlayMap
								position={{
									lat: selectedPlace.y,
									lng: selectedPlace.x,
								}}
							>
								<div
									style={{
										padding: "5px",
										fontSize: "12px",
										textAlign: "center",
										maxWidth: "150px",
										whiteSpace: "pre-wrap",
										wordBreak: "keep-all",
										transform: "translateY(-130%)", // Move the box above the marker with extra space
										background: "white",
										border: "1px solid #ccc",
										borderRadius: "5px",
										boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
									}}
								>
									{selectedPlace.place_name}
								</div>
							</CustomOverlayMap>
						)}
					</Map>
				)}
				{selectedPlace && (
					<div
						style={{
							width: "100%",
							maxWidth: "430px",
							backgroundColor: "rgba(255, 255, 255, 0.9)",
							padding: "10px",
							boxSizing: "border-box",
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
							marginTop: "10px",
						}}
					>
						<div className="text-label-1-normal font-medium text-neutral-70">
							{`서비스 가능 지역`}
						</div>
						<div className="text-heading-1 text-accent-light-blue font-medium mt-[1px]">
							{`${selectedPlace.place_name}`}
						</div>
						<div className="text-headline-1 mt-[1px]">
							{distance?.toFixed(0) || 0}m &nbsp;|&nbsp;{" "}
							{selectedPlace.road_address_name}
						</div>
						<div className="flex items-center mt-[2px]">
							<span className="border-[0.5px] px-[6px] py-[2px] text-body-2-normal text-label-assistive rounded-[4px] text-center">
								지번
							</span>
							<div className="text-body-2-normal text-label-alternative ml-[5px]">
								{selectedPlace.address_name}
							</div>
						</div>
						<div className="text-body-1-normal text-label-alternative mt-[2px]">
							{selectedPlace.phone}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MapWithSearch;
