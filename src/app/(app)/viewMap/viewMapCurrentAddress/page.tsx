// src/app/viewMap/viewMapCurrentAddress/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import TopNavigation from "@/app/(public)/crudAddress/components/common/TopNavigation/page";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    kakao: any;
  }
}

const MapWithSearch: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [homeLocation, setHomeLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const loadScript = (url: string, callback: () => void) => {
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = url;
        script.defer = true;
        script.onload = callback;
        script.onerror = () => console.error("Failed to load script:", url);
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
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
            level: 5,
          };

          const newMap = new window.kakao.maps.Map(container, options);
          setMap(newMap);

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const currentLocation = new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
                newMap.setCenter(currentLocation);
                setHomeLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });

                const imageSrc = "/assets/icons/misc/markerStar.png";
                const imageSize = new window.kakao.maps.Size(24, 35);
                const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

                new window.kakao.maps.Marker({
                  map: newMap,
                  position: currentLocation,
                  title: "Current Location",
                  image: markerImage,
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

                searchPlaces("코인 세탁", newMap, currentLocation, 1200);
              },
              (error) => {
                console.error("Error getting current location", error);
                alert("Error getting current location. Please enable location services and try again.");
              },
              { timeout: 3000 }
            );
          } else {
            alert("Geolocation is not supported by this browser.");
          }
        });
      } else {
        console.error("Kakao Maps script is not loaded correctly.");
      }
    };

    if (typeof window !== "undefined" && typeof document !== "undefined") {
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
      const currentLocation = new window.kakao.maps.LatLng(homeLocation.latitude, homeLocation.longitude);
      map.setCenter(currentLocation);

      searchPlaces("코인 세탁", map, currentLocation, 1200);
    }
  }, [map, homeLocation]);

  const displayMarker = (place: any, map: any, infowindow: any) => {
    const marker = new window.kakao.maps.Marker({
      map: map,
      position: new window.kakao.maps.LatLng(place.y, place.x),
    });

    window.kakao.maps.event.addListener(marker, "click", () => {
      const content = document.createElement("div");
      content.style.padding = "5px";
      content.style.fontSize = "12px";
      content.style.textAlign = "center";
      content.style.width = "150px";
      content.style.whiteSpace = "pre-wrap";
      content.style.wordBreak = "keep-all";
      content.innerText = place.place_name;

      infowindow.setContent(content);
      infowindow.open(map, marker);
      setSelectedPlace(place);
      if (homeLocation) {
        const distance = calculateDistance(homeLocation.latitude, homeLocation.longitude, place.y, place.x);
        setDistance(distance);
      }
    });

    window.kakao.maps.event.addListener(map, "click", () => {
      infowindow.close();
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance * 1000;
  };

  const router = useRouter();

  const handleBackNavigation = () => {
    router.push("/");
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[430px] bg-static-white flex flex-col pt-[5px]">
          <TopNavigation text="지도로 세탁소 보기" onClick={handleBackNavigation} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
        <div id="map" ref={mapRef} style={{ maxWidth: "430px", height: "400px", width: "100%", position: "relative" }} />
        {selectedPlace && (
					<div
						style={{
							width: "100%",
							maxWidth: "430px", // Same max width as the map
							backgroundColor: "rgba(255, 255, 255, 0.9)",
							padding: "10px",
							boxSizing: "border-box",
							boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
							marginTop: "10px", // Ensures the box is below the map with some spacing
						}}
					>
						<div className="text-label-1-normal font-medium text-neutral-70">
							{`서비스 가능 지역`}
						</div>
						<div className="text-heading-1 text-accent-light-blue font-medium mt-[1px]">
							{`${selectedPlace.place_name}`}
						</div>
						<div className="text-headline-1 mt-[1px]">
							{distance?.toFixed(0) || 0}m &nbsp;|&nbsp;
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
