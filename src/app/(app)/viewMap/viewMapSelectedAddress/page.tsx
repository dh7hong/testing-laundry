// src/app/viewMap/viewMapSelectedAddress/page.js
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
  const [selectedAddressGPS, setSelectedAddressGPS] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [homeLocation, setHomeLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const infowindow = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const address = localStorage.getItem("selectedAddressGPS");
      if (address) {
        setSelectedAddressGPS(address);
      } else {
        console.error("No address found in localStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedAddressGPS) {
      return;
    }

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

          const geocoder = new window.kakao.maps.services.Geocoder();

          geocoder.addressSearch(selectedAddressGPS, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
              newMap.setCenter(coords);

              const imageSrc = "/assets/icons/misc/markerStar.png";
              const imageSize = new window.kakao.maps.Size(24, 35);
              const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

              new window.kakao.maps.Marker({
                map: newMap,
                position: coords,
                title: "Selected Address",
                image: markerImage,
              });

              new window.kakao.maps.Circle({
                map: newMap,
                center: coords,
                radius: 1200,
                strokeWeight: 5,
                strokeColor: "#75B8FA",
                strokeOpacity: 0.5,
                strokeStyle: "dashed",
                fillColor: "#CFE7FF",
                fillOpacity: 0.5,
              });

              const homeLocation = {
                latitude: parseFloat(result[0].y),
                longitude: parseFloat(result[0].x),
              };

              setHomeLocation(homeLocation);
              searchPlaces("코인 세탁", newMap, coords, 1200);
            } else {
              console.error("Geocode was not successful for the following reason: " + status);
              alert("Failed to geocode address. Please try again later.");
            }
          });

          window.kakao.maps.event.addListener(newMap, "click", () => {
            if (infowindow.current) {
              infowindow.current.close();
            }
          });
        });
      } else {
        console.error("Kakao Maps script is not loaded correctly.");
      }
    };

    const searchPlaces = (keyword: string, map: any, center: any, radius: number) => {
      if (!window.kakao.maps.services) {
        console.error("Kakao Maps services module is not loaded.");
        return;
      }

      const ps = new window.kakao.maps.services.Places();
      infowindow.current = new window.kakao.maps.InfoWindow({
        zIndex: 1,
      });

      ps.keywordSearch(keyword, (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();

          data.forEach((place: any) => {
            displayMarker(place, map, infowindow.current);
            bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
          });

          map.setBounds(bounds);
        } else {
          console.error("Failed to search places:", status);
          alert("Failed to search places. Please try again later.");
        }
      }, {
        location: center,
        radius: radius,
      });
    };

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
      });
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
  }, [selectedAddressGPS]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
    if (selectedPlace && homeLocation) {
      const distance = calculateDistance(
        homeLocation.latitude,
        homeLocation.longitude,
        selectedPlace.y,
        selectedPlace.x
      );
      setDistance(distance);
      console.log("Distance calculated: ", distance);
    }
  }, [selectedPlace, homeLocation]);

  const router = useRouter();

  const handleBackNavigation = () => {
    router.push("/");
  };

  return (
    <div>
      <div className="flex flex-col items-center bg-gray-50">
				<div className="w-full max-w-[430px] bg-static-white flex flex-col pt-[5px]">
					<TopNavigation text="지도로 세탁소 보기" onClick={handleBackNavigation} />
				</div>
			</div>
			<div style={{ display: "flex", height: "100vh", flexDirection: "column", alignItems: "center" }}>
				<div id="map" ref={mapRef} style={{ maxWidth: "430px", height: "400px", width: "100%" }} />
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
						<div className="text-label-1-normal font-medium text-neutral-70">{`서비스 가능 지역`}</div>
						<div className="text-heading-1 text-accent-light-blue font-medium mt-[1px]">{`${selectedPlace.place_name}`}</div>
						<div className="text-headline-1 mt-[1px]">
							{distance?.toFixed(0) || 0}m &nbsp;|&nbsp; {selectedPlace.road_address_name}
						</div>
						<div className="flex items-center mt-[2px]">
							<span className="border-[0.5px] px-[6px] py-[2px] text-body-2-normal text-label-assistive rounded-[4px] text-center">
								지번
							</span>
							<div className="text-body-2-normal text-label-alternative ml-[5px]">{selectedPlace.address_name}</div>
						</div>
						<div className="text-body-1-normal text-label-alternative mt-[2px]">{selectedPlace.phone}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MapWithSearch;
