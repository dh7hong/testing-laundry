"use client";

import TopNavigation from "@/app/(public)/crudAddress/components/common/TopNavigation/page";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

declare global {
	interface Window {
		kakao: any;
	}
}

const MapWithSearch: React.FC = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<any>(null);
	const [selectedPlace, setSelectedPlace] = useState<any>(null);
	const [homeLocation, setHomeLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);
	const [distance, setDistance] = useState<number | null>(null);

	const searchPlaces = (
		keyword: string,
		map: any,
		center: any,
		radius: number
	) => {
		if (!window.kakao.maps.services) {
			console.error("Kakao Maps services module is not loaded.");
			return;
		}

		const ps = new window.kakao.maps.services.Places();
		const infowindow = new window.kakao.maps.InfoWindow({
			zIndex: 1,
		});

		ps.keywordSearch(
			keyword,
			(data: any, status: any) => {
				if (status === window.kakao.maps.services.Status.OK) {
					const bounds = new window.kakao.maps.LatLngBounds();

					data.forEach((place: any) => {
						displayMarker(place, map, infowindow);
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
				location: center,
				radius: radius,
			}
		);
	};

	useEffect(() => {
		const loadScript = (url: string, callback: () => void) => {
			const existingScript = document.querySelector(
				`script[src="${url}"]`
			);
			if (!existingScript) {
				const script = document.createElement("script");
				script.src = url;
				script.defer = true;
				script.onload = callback;
				script.onerror = () =>
					console.error("Failed to load script:", url);
				document.head.appendChild(script);
			} else {
				callback();
			}
		};

		const initializeMap = () => {
			if (window.kakao && window.kakao.maps) {
				window.kakao.maps.load(() => {
					const container = mapRef.current;
					const options = {
						center: new window.kakao.maps.LatLng(
							37.566826,
							126.9786567
						), // Default location
						level: 5,
					};

					const newMap = new window.kakao.maps.Map(
						container,
						options
					);
					setMap(newMap);

					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(
							(position) => {
								const currentLocation =
									new window.kakao.maps.LatLng(
										position.coords.latitude,
										position.coords.longitude
									);
								newMap.setCenter(currentLocation);
								setHomeLocation({
									latitude: position.coords.latitude,
									longitude: position.coords.longitude,
								});

								// Custom image for the current location marker
								const imageSrc =
									"https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // Replace with your custom image URL
								const imageSize = new window.kakao.maps.Size(
									24,
									35
								); // Size of the marker image
								const markerImage =
									new window.kakao.maps.MarkerImage(
										imageSrc,
										imageSize
									);

								new window.kakao.maps.Marker({
									map: newMap,
									position: currentLocation,
									title: "Current Location",
									image: markerImage, // Use the custom marker image
								});

								new window.kakao.maps.Circle({
									map: newMap,
									center: currentLocation,
									radius: 1200,
									strokeWeight: 5,
									strokeColor: "#75B8FA",
									strokeOpacity: 0.5,
									strokeStyle: "dashed",
									fillColor: "#CFE7FF",
									fillOpacity: 0.5,
								});

								searchPlaces(
									"코인 세탁",
									newMap,
									currentLocation,
									1200
								);
							},
							(error) => {
								console.error(
									"Error getting current location",
									error
								);
								alert(
									"Error getting current location. Please enable location services and try again."
								);
							},
							{ timeout: 3000 } // Optional: Add a timeout to handle the case where location retrieval takes too long
						);
					} else {
						alert(
							"Geolocation is not supported by this browser."
						);
					}
				});
			} else {
				console.error(
					"Kakao Maps script is not loaded correctly."
				);
			}
		};

		if (
			typeof window !== "undefined" &&
			typeof document !== "undefined"
		) {
			loadScript(
				`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`,
				() => {
					console.log("Kakao Maps script loaded.");
					initializeMap();
				}
			);
		}
	}, []);

	useEffect(() => {
		if (map && homeLocation) {
			const currentLocation = new window.kakao.maps.LatLng(
				homeLocation.latitude,
				homeLocation.longitude
			);
			map.setCenter(currentLocation);

			searchPlaces("코인 세탁", map, currentLocation, 1200);
		}
	}, [map, homeLocation]);

	const displayMarker = (
		place: any,
		map: any,
		infowindow: any
	) => {
		const marker = new window.kakao.maps.Marker({
			map: map,
			position: new window.kakao.maps.LatLng(place.y, place.x),
		});

		window.kakao.maps.event.addListener(marker, "click", () => {
			// Create a div element and set its content and styles
			const content = document.createElement("div");
			content.style.padding = "5px";
			content.style.fontSize = "12px";
			content.style.textAlign = "center";
			content.style.width = "150px";
			content.style.whiteSpace = "pre-wrap"; // Ensures that text wraps correctly for Korean
			content.style.wordBreak = "keep-all"; // Ensures long words break correctly
			content.innerText = place.place_name;

			// Set the infowindow content
			infowindow.setContent(content);
			infowindow.open(map, marker);
			setSelectedPlace(place); // Set the selected place information
			if (homeLocation) {
				const distance = calculateDistance(
					homeLocation.latitude,
					homeLocation.longitude,
					place.y,
					place.x
				);
				setDistance(distance);
			}
		});

		// Close the infowindow when clicking somewhere else on the map
		window.kakao.maps.event.addListener(map, "click", () => {
			infowindow.close();
		});
	};

	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	): number => {
		const R = 6371; // Radius of the Earth in kilometers
		const dLat = (lat2 - lat1) * (Math.PI / 180);
		const dLon = (lon2 - lon1) * (Math.PI / 180);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * (Math.PI / 180)) *
				Math.cos(lat2 * (Math.PI / 180)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c; // Distance in kilometers
		return distance * 1000;
	};

	const router = useRouter();

	const handleBackNavigation = () => {
		router.push("/");
	};

	return (
		<div>
			<div className="flex flex-col items-center bg-gray-50">
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
				<div
					id="map"
					ref={mapRef}
					style={{
						maxWidth: "430px",
						height: "400px",
						width: "100%",
					}}
				/>
				{selectedPlace && (
					<div
						style={{ textAlign: "center", marginTop: "20px" }}
					>
						<h3>{selectedPlace.place_name}</h3>
						<p>{selectedPlace.road_address_name}</p>
						<p>{selectedPlace.address_name}</p>
						<p>{selectedPlace.phone}</p>
						{distance !== null && (
							<p>Distance from home: {distance.toFixed(0)} m</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default MapWithSearch;
