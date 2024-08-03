// src/context/AddressContext.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAddressesByPhoneNumber,
  deleteInputAddress,
  updateInputAddress,
} from "@/utils/api";
import CustomModal from "@/app/(public)/crudAddress/components/common/CustomModal/page";
import Location from "@/assets/icons/editAddress/location.svg";
import Check from "@/assets/icons/editAddress/check-large.svg";
import TopNavigation from "@/app/(public)/crudAddress/components/common/TopNavigation/page";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import BasicDivider from "@/app/(public)/crudAddress/components/common/BasicDivider/page";
import ActionButtonWhite from "@/app/(public)/crudAddress/components/ActionButtonWhite/page";
import Toast from "@/components/crudAddress/Toast";

interface Address {
  _id: string;
  shippingName: string;
  selectedAddress: string;
  isDefault: boolean;
}

export const setDefaultShippingAddress = async (phoneNumber: string) => {
  try {
    const addresses = await getAddressesByPhoneNumber(phoneNumber);
    const defaultAddress = addresses.find((address: any) => address.isDefault);
    if (defaultAddress) {
      localStorage.setItem(
        "selectedAddress",
        JSON.stringify(defaultAddress.selectedAddress)
      );
      localStorage.setItem(
        "shippingName",
        JSON.stringify(defaultAddress.shippingName)
      );
      const regex = /[가-힣 ]+ [가-힣]+[구] [가-힣]+[로길]/;
      const matchedAddress = defaultAddress.selectedAddress.match(regex);
      if (matchedAddress) {
        localStorage.setItem(
          "shippingAddress",
          JSON.stringify(matchedAddress[0])
        );
      }
			
      // Geocode the default address to get its coordinates
      const loadKakaoMaps = (): Promise<any> => {
        return new Promise((resolve, reject) => {
          const existingScript = document.querySelector(
            `script[src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false"]`
          );

          if (!existingScript) {
            const script = document.createElement("script");
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`;
            script.async = true;
            script.onload = () => {
              if (window.kakao && window.kakao.maps) {
                resolve(window.kakao);
              } else {
                reject(new Error("Kakao Maps not available"));
              }
            };
            script.onerror = () =>
              reject(new Error("Failed to load Kakao Maps script."));
            document.head.appendChild(script);
          } else {
            existingScript.addEventListener("load", () => {
              if (window.kakao && window.kakao.maps) {
                resolve(window.kakao);
              } else {
                reject(new Error("Kakao Maps not available"));
              }
            });
            if (window.kakao && window.kakao.maps) {
              resolve(window.kakao);
            }
          }
        });
      };

      await loadKakaoMaps()
        .then((kakao: any) => {
          if (kakao && kakao.maps) {
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(
              defaultAddress.selectedAddress,
              (result: { y: any; x: any }[], status: any) => {
                if (status === kakao.maps.services.Status.OK) {
                  const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                  localStorage.setItem("latitude", coords.getLat().toString());
                  localStorage.setItem("longitude", coords.getLng().toString());
                } else {
                  console.error("Failed to geocode address:", status);
                }
              }
            );
          }
        })
        .catch((error) => console.error(error.message));
    }
  } catch (error) {
    console.error("Failed to fetch default address:", error);
  }
};

const AddressList: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDefaultModal, setShowDefaultModal] = useState<boolean>(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [phoneNumber] = useLocalStorage<string>("phoneNumber", "");
  const router = useRouter();


	
  useEffect(() => {
    if (phoneNumber) {
      fetchAddresses(phoneNumber);
    }
  }, [phoneNumber]);

  const fetchAddresses = async (phone: string) => {
    try {
      const fetchedAddresses = await getAddressesByPhoneNumber(phone);
      setAddresses(fetchedAddresses);
      console.log("Fetched addresses:", fetchedAddresses);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedAddressId) {
      try {
        await deleteInputAddress(selectedAddressId);
        setAddresses(
          addresses.filter((address) => address._id !== selectedAddressId)
        );
        setShowDeleteModal(false);
        setToastMessage("배송지가 삭제되었습니다.");
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      } catch (error) {
        console.error("Failed to delete address:", error);
      }
    }
  };

  const handleSetDefault = async () => {
    if (selectedAddressId) {
      try {
        // Update the selected address to be the default
        await updateInputAddress(selectedAddressId, {
          isDefault: true,
        });
        // Update all other addresses to not be the default
        const updatedAddresses = addresses.map((address) => {
          if (address._id === selectedAddressId) {
            return { ...address, isDefault: true };
          } else if (address.isDefault) {
            updateInputAddress(address._id, {
              isDefault: false,
            });
            return { ...address, isDefault: false };
          }
          return address;
        });
        setAddresses(updatedAddresses);
        setShowDefaultModal(false);
        setToastMessage("기본 배송지가 변경되었습니다.");
        setShowToast(true);
        // setDefaultShippingAddress(phoneNumber);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      } catch (error) {
        console.error("Failed to set default address:", error);
      }
    }
  };

  const handleBackNavigation = async () => {
    await setDefaultShippingAddress(phoneNumber);
    setTimeout(() => {
      router.push("/");
    }, 2000);
    console.log(
      "default address set successfully to:",
      JSON.parse(localStorage.getItem("shippingAddress") || "null")
    );
    // router.push("/")
  };

  const handleEdit = (id: string) => {
    console.log(`the id is: ${id}`);
    localStorage.setItem("editAddressId", id);
    // this is where the id is stored in local storage for the editAddress page
    router.push(`/crudAddress/editAddress/${id}`);
  };

  const handleAddNewAddress = () => {
    router.push("/enterAddress/inputAddress/shippingName");
  };

  return (
    <>
      <div className="flex flex-col items-center bg-gray-50 min-h-screen">
        <Toast message={toastMessage} show={showToast} />
        <div className="w-full max-w-[430px] bg-static-white flex flex-col pt-[5px]">
          <TopNavigation
            text="배송지 설정"
            onClick={handleBackNavigation}
          ></TopNavigation>
        </div>
        <div></div>
        <div className="w-full max-w-[430px] bg-white flex flex-col overflow-auto">
          {"    "}
          {addresses.map((address) => (
            <div key={address._id} className="pt-[16px] px-[20px]">
              <div className="flex flex-col">
                <div className="flex">
                  <div className="flex items-center justify-center text-body-1-normal leading-5 font-semibold ml-[32px]">
                    {address.shippingName}
                  </div>
                  {address.isDefault && (
                    <div className="ml-[6px] rounded-xl bg-[#F7F7F7] text-[#1677FF] text-label-2 px-[8px] py-[4px] font-semibold">
                      기본 배송지
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <div className="flex items-center justify-center w-[24px] h-[24px] mr-[8px]">
                    <Location />
                  </div>
                  <div
                    className="flex-grow text-label-1-normal font-normal"
                    style={{ wordBreak: "keep-all" }}
                  >
                    {address.selectedAddress}
                  </div>
                  {address.isDefault && (
                    <Check className="w-[28px] h-[28px] ml-auto" />
                  )}
                </div>
              </div>

              <div className="mt-2 flex">
                <div className="w-[32px]" />
                <button
                  onClick={() => handleEdit(address._id)}
                  className="text-caption-1 font-medium px-[10px] py-[6px] border border-label-disable rounded-xl mr-2"
                >
                  수정
                </button>
                {!address.isDefault && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedAddressId(address._id);
                        setShowDeleteModal(true);
                      }}
                      className="text-caption-1 font-medium px-[10px] py-[6px] border border-label-disable rounded-xl mr-2"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAddressId(address._id);
                        setShowDefaultModal(true);
                      }}
                      className="text-caption-1 font-medium px-[10px] py-[6px] border border-label-disable rounded-xl"
                    >
                      기본 배송지로 변경
                    </button>
                  </>
                )}
              </div>
              <div className="mt-[16px]">
                <BasicDivider
                  width="calc(100%)" // Adjust width calculation
                  className="!bg-line-neutral max-w-[430px]"
                  variant="normal"
                  vertical={false}
                />
              </div>
            </div>
          ))}
          {"    "}
        </div>

        <ActionButtonWhite label="새 배송지 추가" onClick={handleAddNewAddress} />

        <CustomModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="배송지를 삭제하시겠어요?"
        ></CustomModal>

        <CustomModal
          isOpen={showDefaultModal}
          onClose={() => setShowDefaultModal(false)}
          onConfirm={handleSetDefault}
          title="기본 배송지로 변경하시겠어요?"
        ></CustomModal>
        <div className="flex-grow w-full max-w-[430px] bg-static-white"></div>
      </div>
    </>
  );
};

export default AddressList;
