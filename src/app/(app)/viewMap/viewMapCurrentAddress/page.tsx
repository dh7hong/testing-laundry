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

// Utility function to get the current location
export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 3000 }
      );
    } else {
      reject(
        new Error("Geolocation is not supported by this browser.")
      );
    }
  });
};

const ViewMapCurrentAddress: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [places, setPlaces] = useState<any[]>([]);

  const router = useRouter();

  // Function to navigate back to the home page
  const handleBackNavigation = () => {
    router.push("/enterAddress/inputAddress/phoneStart");
  };

  // Get the current location on component mount
  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        setCurrentLocation(location);
      })
      .catch((error) => {
        console.error("Error getting current location", error);
        alert(
          "Error getting current location. Please enable location services and try again."
        );
      });
  }, []);

  // Utility function to calculate the distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters
    return distance;
  };

  // Calculate distance for the selected place
  useEffect(() => {
    if (selectedPlace && currentLocation) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        selectedPlace.y,
        selectedPlace.x
      );
      setDistance(distance);
    }
  }, [selectedPlace, currentLocation]);

  // Handle click event on a marker
  const handleMarkerClick = (place: any) => {
    setSelectedPlace(place);
    if (currentLocation) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        place.y,
        place.x
      );
      setDistance(distance);
    }
  };

  // Reset selected place on map click
  const handleMapClick = () => {
    setSelectedPlace(null);
  };

  // Perform keyword search to find places around the current location
  useEffect(() => {
    if (map && currentLocation) {
      const ps = new window.kakao.maps.services.Places();

      ps.keywordSearch(
        "코인 세탁",
        (data: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const placesWithDistance = data.map((place: any) => ({
              ...place,
              distance: calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                place.y,
                place.x
              ),
            }));
            setPlaces(placesWithDistance);
            localStorage.setItem(
              "places",
              JSON.stringify(placesWithDistance)
            );
            const bounds = new window.kakao.maps.LatLngBounds();
            placesWithDistance.forEach((place: any) => {
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
            currentLocation.latitude,
            currentLocation.longitude
          ),
          radius: 1200,
        }
      );
    }
  }, [map, currentLocation]);

  // Navigate to the list of all places nearby
  const navigateToPlacesList = () => {
    router.push("/viewMap/viewPlacesSelectedAddress");
  };

  return (
    <div className="flex flex-col items-center bg-gray-50">
      <div className="w-full max-w-[430px] bg-white p-4 pb-[32px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            지금 위치 지도로 보기
          </h2>
          <button
            className="text-blue-500 hover:underline"
            onClick={handleBackNavigation}
          >
            주소 목록 가기
          </button>
        </div>

        {currentLocation && (
          <Map
            center={{
              lat: currentLocation.latitude,
              lng: currentLocation.longitude,
            }}
            style={{
              width: "100%",
              height: "400px",
            }}
            level={5}
            onCreate={setMap}
            onClick={handleMapClick}
          >
            <MapMarker
              position={{
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
              }}
              title="Current Location"
              image={{
                src: "/assets/icons/misc/markerStar.png",
                size: { width: 24, height: 35 },
              }}
            />
            <Circle
              center={{
                lat: currentLocation.latitude,
                lng: currentLocation.longitude,
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
                    width: "150px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "keep-all",
                    transform: "translateY(-130%)",
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
          <div className="bg-white mt-4 p-4 rounded-lg shadow-md">
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
              &nbsp;{selectedPlace.phone}
            </div>
          </div>
        )}
        <button
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          onClick={navigateToPlacesList}
        >
          내 주위 모든 세탁 현황 보기
        </button>
      </div>
    </div>
  );
};

export default ViewMapCurrentAddress;
