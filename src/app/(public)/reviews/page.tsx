"use client";
import React, { useState } from "react";
import ReviewPage from "@/app/(public)/reviewPage/page";
import ReviewForm from "@/app/(public)/reviewForm/page";
import { useAuth } from "@/context/AuthContext";

type Review = {
	reviewerName: string;
	reviewDate: string;
	laundromatName: string;
	laundromatType: string;
	rating: number;
	text: string;
	images: string[];
};

// Static phone numbers
const staticPhoneNumbers = [
	"010-12******",
	"010-34******",
	"010-56******",
	"010-78******",
	"010-90******",
	"010-23******",
	"010-45******",
	"010-67******",
	"010-89******",
	"010-01******",
	"010-22******",
	"010-33******",
	"010-44******",
	"010-55******",
	"010-66******",
	"010-77******",
	"010-88******",
	"010-99******",
	"010-11******",
	"010-21******",
	"010-31******",
	"010-41******",
	"010-51******",
	"010-61******",
	"010-71******",
	"010-81******",
	"010-91******",
	"010-02******",
	"010-13******",
	"010-24******",
	"010-35******",
	"010-46******",
	"010-57******",
	"010-68******",
	"010-79******",
	"010-80******",
	"010-12******",
	"010-45******",
	"010-78******",
	"010-11******",
	"010-32******",
	"010-54******",
	"010-76******",
	"010-98******",
	"010-30******",
	"010-52******",
	"010-74******",
	"010-96******",
	"010-10******",
	"010-20******",
];

// Static dates between 2024-06-15 and 2024-08-03
const staticDates = [
	"2024-06-15",
	"2024-06-17",
	"2024-06-19",
	"2024-06-21",
	"2024-06-23",
	"2024-06-25",
	"2024-06-27",
	"2024-06-29",
	"2024-07-01",
	"2024-07-03",
	"2024-07-05",
	"2024-07-07",
	"2024-07-09",
	"2024-07-11",
	"2024-07-13",
	"2024-07-15",
	"2024-07-17",
	"2024-07-19",
	"2024-07-21",
	"2024-07-23",
	"2024-07-25",
	"2024-07-27",
	"2024-07-29",
	"2024-07-31",
	"2024-08-01",
	"2024-06-16",
	"2024-06-18",
	"2024-06-20",
	"2024-06-22",
	"2024-06-24",
	"2024-06-26",
	"2024-06-28",
	"2024-06-30",
	"2024-07-02",
	"2024-07-04",
	"2024-07-06",
	"2024-07-08",
	"2024-07-10",
	"2024-07-12",
	"2024-07-14",
	"2024-07-16",
	"2024-07-18",
	"2024-07-20",
	"2024-07-22",
	"2024-07-24",
	"2024-07-26",
	"2024-07-28",
	"2024-07-30",
	"2024-08-02",
	"2024-08-03",
];

// Static laundromat names
const laundromatNames = [
	"서울 서대문구 세탁소",
	"서울 강남구 클린센터",
	"서울 종로구 빨래방",
	"서울 영등포구 청결세탁소",
	"서울 마포구 세탁의달인",
	"서울 용산구 얼룩제거",
	"서울 성북구 새벽세탁",
	"서울 송파구 신속세탁",
	"서울 동작구 코인세탁",
	"서울 서초구 전문가세탁",
	"서울 관악구 세탁나라",
	"서울 구로구 세탁킹",
	"서울 양천구 세탁마스터",
	"서울 노원구 최고의세탁소",
	"서울 중구 손빨래방",
	"서울 도봉구 패브릭케어",
	"서울 강북구 파워세탁",
	"서울 동대문구 스피드세탁",
	"서울 중랑구 프로세탁",
	"서울 은평구 프로페셔널세탁",
];

// Static laundromat types
const laundromatTypes = [
	"∙ 팀 세탁",
	"∙ 알뜰 세탁",
	"∙ 단독 세탁",
];

// Static review texts over 200 characters
const reviewTexts = [
	"이 세탁소는 정말 최고입니다. 매번 옷이 새것처럼 돌아오고, 직원들의 친절함에 감동합니다. 다양한 세탁 옵션과 합리적인 가격 덕분에 늘 만족합니다. 바쁜 일정 속에서도 빠르고 정확한 서비스를 제공해 주셔서 고맙습니다. 다른 세탁소와는 비교할 수 없는 퀄리티에요!",
	"여기서 세탁한 옷은 항상 깨끗하게 돌아옵니다. 얼룩이나 오염을 말끔히 처리해주셔서 믿고 맡길 수 있습니다. 바쁜 일정 속에서도 신속하게 세탁해주셔서 감사합니다. 세탁 후에는 옷이 새로 산 것처럼 기분이 좋아집니다. 다시 찾고 싶은 세탁소입니다!",
	"서울에서 가장 만족스러운 세탁 서비스를 제공하는 곳입니다. 직원들이 항상 친절하고, 세탁 상태도 훌륭합니다. 매번 옷이 새것처럼 돌아오니 믿고 맡길 수 있어요. 가격도 적절해서 좋고, 바쁜 일정 속에서도 빠르게 처리해주셔서 감사합니다!",
	"세탁물을 맡기면 항상 기대 이상의 결과를 얻습니다. 얼룩 하나 없이 말끔해진 옷을 보니 기분이 좋습니다. 특히 겨울 코트나 두꺼운 옷도 전혀 손상 없이 돌아와서 믿고 맡길 수 있습니다. 이런 세탁소를 만나게 되어 정말 다행입니다. 추천합니다!",
	"이 세탁소 덕분에 매일매일의 세탁 스트레스가 사라졌습니다. 친절한 직원분들이 옷을 세심하게 관리해주셔서 언제나 만족스러운 결과를 얻고 있습니다. 가격도 합리적이고 서비스가 뛰어나서 다른 곳으로는 눈이 가지 않네요. 앞으로도 계속 이용할 예정입니다. 감사합니다!",
	"이곳에서 세탁한 옷은 항상 만족스럽습니다. 깔끔하게 다림질된 옷을 받으면 하루가 행복해집니다. 특히 겨울 코트나 두꺼운 옷도 전혀 손상 없이 돌아오니 믿고 맡길 수 있어요. 서울에서 이런 서비스를 받는 게 쉽지 않은데, 정말 감사드립니다. 추천합니다!",
	"세탁소를 찾다가 우연히 발견한 곳인데, 이제는 단골이 되었습니다. 옷 상태가 너무 좋아서 언제나 만족스럽고, 친절한 직원들 덕분에 기분 좋게 방문할 수 있습니다. 가격도 합리적이어서 자주 이용할 생각입니다. 적극 추천합니다!",
	"세탁 후 옷이 너무 깨끗하게 돌아와서 감동했습니다. 얼룩 하나 없이 말끔해진 옷을 보니 기분이 좋습니다. 직원분들도 항상 친절하게 맞아주셔서 기분 좋게 방문할 수 있습니다. 앞으로도 계속 이용할 예정입니다. 정말 감사드립니다!",
	"옷이 깨끗하게 세탁되어 돌아오는 것은 기본이고, 직원분들이 아주 친절하십니다. 매번 옷을 찾으러 갈 때마다 기분 좋게 맞아주시고, 세탁 상태도 꼼꼼히 체크해주셔서 감사합니다. 항상 믿고 맡길 수 있어요. 이번에도 대단히 만족했습니다!",
	"옷에 남아 있던 얼룩이 완벽히 사라져서 놀랐습니다. 세탁 서비스를 여러 번 이용했지만 이곳만큼 완벽한 곳은 없었습니다. 매번 기대 이상으로 옷이 돌아와서 매우 만족스럽습니다. 빠르고 정확한 세탁 덕분에 언제나 기분이 좋습니다. 감사합니다!",
	"매번 이용할 때마다 이 세탁소의 퀄리티에 놀랍니다. 옷이 새것처럼 돌아와서 기분이 좋고, 얼룩이나 오염도 완벽히 제거해주셔서 감사합니다. 서비스도 친절하고 가격도 합리적이어서 매우 만족스럽습니다. 앞으로도 계속 이용할 예정입니다!",
	"이 세탁소 덕분에 옷 관리가 훨씬 쉬워졌습니다. 매번 옷을 깨끗하게 다려주셔서 너무 만족스럽습니다. 특히 얼룩이나 오염이 심한 옷도 전혀 문제 없이 처리해주셔서 항상 믿고 맡길 수 있습니다. 앞으로도 계속 이용할 예정입니다!",
	"옷이 정말 깨끗하게 세탁되어 돌아왔습니다. 직원분들이 친절하고, 세탁 상태도 꼼꼼히 체크해주셔서 안심하고 맡길 수 있어요. 항상 기대 이상의 결과를 얻고 있습니다. 가격도 합리적이고, 서비스가 좋아서 자주 이용할 것 같습니다. 감사합니다!",
	"세탁소를 이용한 이후로 다른 곳은 생각도 나지 않습니다. 옷이 새것처럼 돌아오고, 직원분들의 친절함에 감동합니다. 특히 겨울 코트나 두꺼운 옷도 전혀 손상 없이 돌아와서 믿고 맡길 수 있습니다. 정말 훌륭한 서비스에 감사합니다!",
	"서울에서 가장 만족스러운 세탁소입니다. 옷을 맡기면 언제나 새것처럼 깨끗하게 돌아오고, 직원분들이 친절해서 좋습니다. 다양한 세탁 옵션과 합리적인 가격 덕분에 자주 이용하고 있습니다. 앞으로도 계속 이용할 계획입니다. 감사합니다!",
	"옷을 맡기고 나면 항상 새옷을 받는 기분입니다. 깨끗하고 향기롭게 세탁된 옷을 보면 하루의 피로가 풀립니다. 서울에서 이렇게 훌륭한 서비스를 받을 수 있는 곳이 많지 않은데, 이곳은 그중에서도 최고입니다. 감사합니다!",
	"옷을 맡기고 나면 항상 기대 이상의 결과를 얻습니다. 매번 옷이 새것처럼 깨끗하게 돌아오니 너무 만족스럽습니다. 서비스도 친절하고 가격도 합리적이어서 계속 이용할 예정입니다. 정말 감사드리고, 추천합니다!",
	"이번에도 옷을 깨끗하게 세탁해주셔서 감사합니다. 매번 만족스럽게 이용하고 있고, 직원분들도 항상 친절하셔서 기분 좋게 방문합니다. 옷에 남아 있던 얼룩이 완벽히 사라져서 감동했습니다. 세탁소 추천합니다. 감사합니다!",
	"옷이 정말 깨끗하게 세탁되어 돌아왔습니다. 얼룩 하나 없이 말끔해진 옷을 보니 기분이 좋습니다. 직원분들도 항상 친절하게 맞아주셔서 기분 좋게 방문할 수 있습니다. 앞으로도 계속 이용할 예정입니다. 정말 감사드립니다!",
	"이번에도 세탁 상태가 훌륭해서 기분이 좋습니다. 옷이 항상 깨끗하고 정갈하게 정리되어 돌아오니 믿고 맡길 수 있습니다. 매번 기대 이상의 서비스를 제공해주셔서 감사드리고, 앞으로도 이곳을 이용할 것입니다. 매우 추천합니다!",
	"세탁물의 상태가 항상 훌륭합니다. 옷이 새것처럼 돌아와서 매번 감동합니다. 직원분들도 친절하셔서 기분 좋게 방문할 수 있습니다. 가격도 합리적이고, 서비스가 뛰어나서 자주 이용할 것 같습니다. 감사합니다. 매우 추천합니다!",
	"옷이 정말 깨끗하게 세탁되어 돌아왔습니다. 직원분들이 친절하고, 세탁 상태도 꼼꼼히 체크해주셔서 안심하고 맡길 수 있어요. 항상 기대 이상의 결과를 얻고 있습니다. 가격도 합리적이고, 서비스가 좋아서 자주 이용할 것 같습니다. 감사합니다!",
	"여기서 세탁한 옷은 항상 깨끗하게 돌아옵니다. 얼룩이나 오염을 말끔히 처리해주셔서 믿고 맡길 수 있습니다. 바쁜 일정 속에서도 신속하게 세탁해주셔서 감사합니다. 세탁 후에는 옷이 새로 산 것처럼 기분이 좋아집니다. 다시 찾고 싶은 세탁소입니다!",
	"옷을 맡기고 나면 항상 새옷을 받는 기분입니다. 깨끗하고 향기롭게 세탁된 옷을 보면 하루의 피로가 풀립니다. 서울에서 이렇게 훌륭한 서비스를 받을 수 있는 곳이 많지 않은데, 이곳은 그중에서도 최고입니다. 감사합니다!",
	"세탁 후 옷이 너무 깨끗하게 돌아와서 감동했습니다. 얼룩 하나 없이 말끔해진 옷을 보니 기분이 좋습니다. 직원분들도 항상 친절하게 맞아주셔서 기분 좋게 방문할 수 있습니다. 앞으로도 계속 이용할 예정입니다. 정말 감사드립니다!",
	"매번 이용할 때마다 이 세탁소의 퀄리티에 놀랍니다. 옷이 새것처럼 돌아와서 기분이 좋고, 얼룩이나 오염도 완벽히 제거해주셔서 감사합니다. 서비스도 친절하고 가격도 합리적이어서 매우 만족스럽습니다. 앞으로도 계속 이용할 예정입니다!",
	"세탁소를 이용한 이후로 다른 곳은 생각도 나지 않습니다. 옷이 새것처럼 돌아오고, 직원분들의 친절함에 감동합니다. 특히 겨울 코트나 두꺼운 옷도 전혀 손상 없이 돌아와서 믿고 맡길 수 있습니다. 정말 훌륭한 서비스에 감사합니다!",
	"세탁소를 찾다가 우연히 발견한 곳인데, 이제는 단골이 되었습니다. 옷 상태가 너무 좋아서 언제나 만족스럽고, 친절한 직원들 덕분에 기분 좋게 방문할 수 있습니다. 가격도 합리적이어서 자주 이용할 생각입니다. 적극 추천합니다!",
	"서울에서 가장 만족스러운 세탁소입니다. 옷을 맡기면 언제나 새것처럼 깨끗하게 돌아오고, 직원분들이 친절해서 좋습니다. 다양한 세탁 옵션과 합리적인 가격 덕분에 자주 이용하고 있습니다. 앞으로도 계속 이용할 계획입니다. 감사합니다!",
	"매번 이용할 때마다 이 세탁소의 퀄리티에 놀랍니다. 옷이 새것처럼 돌아와서 기분이 좋고, 얼룩이나 오염도 완벽히 제거해주셔서 감사합니다. 서비스도 친절하고 가격도 합리적이어서 매우 만족스럽습니다. 앞으로도 계속 이용할 예정입니다!",
	"이곳에서 세탁한 옷은 항상 만족스럽습니다. 깔끔하게 다림질된 옷을 받으면 하루가 행복해집니다. 특히 겨울 코트나 두꺼운 옷도 전혀 손상 없이 돌아오니 믿고 맡길 수 있어요. 서울에서 이런 서비스를 받는 게 쉽지 않은데, 정말 감사드립니다. 추천합니다!",
	"옷이 정말 깨끗하게 세탁되어 돌아왔습니다. 얼룩 하나 없이 말끔해진 옷을 보니 기분이 좋습니다. 직원분들도 항상 친절하게 맞아주셔서 기분 좋게 방문할 수 있습니다. 앞으로도 계속 이용할 예정입니다. 정말 감사드립니다!",
	"이 세탁소 덕분에 옷 관리가 훨씬 쉬워졌습니다. 매번 옷을 깨끗하게 다려주셔서 너무 만족스럽습니다. 특히 얼룩이나 오염이 심한 옷도 전혀 문제 없이 처리해주셔서 항상 믿고 맡길 수 있습니다. 앞으로도 계속 이용할 예정입니다!",
	"이 세탁소는 정말 최고입니다. 매번 옷이 새것처럼 돌아오고, 직원들의 친절함에 감동합니다. 다양한 세탁 옵션과 합리적인 가격 덕분에 늘 만족합니다. 바쁜 일정 속에서도 빠르고 정확한 서비스를 제공해 주셔서 고맙습니다. 다른 세탁소와는 비교할 수 없는 퀄리티에요!",
	"세탁물의 상태가 항상 훌륭합니다. 옷이 새것처럼 돌아와서 매번 감동합니다. 직원분들도 친절하셔서 기분 좋게 방문할 수 있습니다. 가격도 합리적이고, 서비스가 뛰어나서 자주 이용할 것 같습니다. 감사합니다. 매우 추천합니다!",
	"옷을 맡기고 나면 항상 새옷을 받는 기분입니다. 깨끗하고 향기롭게 세탁된 옷을 보면 하루의 피로가 풀립니다. 서울에서 이렇게 훌륭한 서비스를 받을 수 있는 곳이 많지 않은데, 이곳은 그중에서도 최고입니다. 감사합니다!",
	"옷이 정말 깨끗하게 세탁되어 돌아왔습니다. 직원분들이 친절하고, 세탁 상태도 꼼꼼히 체크해주셔서 안심하고 맡길 수 있어요. 항상 기대 이상의 결과를 얻고 있습니다. 가격도 합리적이고, 서비스가 좋아서 자주 이용할 것 같습니다. 감사합니다!",
	"이 세탁소 덕분에 옷 관리가 훨씬 쉬워졌습니다. 매번 옷을 깨끗하게 다려주셔서 너무 만족스럽습니다. 특히 얼룩이나 오염이 심한 옷도 전혀 문제 없이 처리해주셔서 항상 믿고 맡길 수 있습니다. 앞으로도 계속 이용할 예정입니다!",
	"서울에서 가장 만족스러운 세탁소입니다. 옷을 맡기면 언제나 새것처럼 깨끗하게 돌아오고, 직원분들이 친절해서 좋습니다. 다양한 세탁 옵션과 합리적인 가격 덕분에 자주 이용하고 있습니다. 앞으로도 계속 이용할 계획입니다. 감사합니다!",
	"세탁 후 옷이 너무 깨끗하게 돌아와서 감동했습니다. 얼룩 하나 없이 말끔해진 옷을 보니 기분이 좋습니다. 직원분들도 항상 친절하게 맞아주셔서 기분 좋게 방문할 수 있습니다. 앞으로도 계속 이용할 예정입니다. 정말 감사드립니다!",
	"옷에 남아 있던 얼룩이 완벽히 사라져서 놀랐습니다. 세탁 서비스를 여러 번 이용했지만 이곳만큼 완벽한 곳은 없었습니다. 매번 기대 이상으로 옷이 돌아와서 매우 만족스럽습니다. 빠르고 정확한 세탁 덕분에 언제나 기분이 좋습니다. 감사합니다!",
	"여기서 세탁한 옷은 항상 깨끗하게 돌아옵니다. 얼룩이나 오염을 말끔히 처리해주셔서 믿고 맡길 수 있습니다. 바쁜 일정 속에서도 신속하게 세탁해주셔서 감사합니다. 세탁 후에는 옷이 새로 산 것처럼 기분이 좋아집니다. 다시 찾고 싶은 세탁소입니다!",
	"이번에도 세탁 상태가 훌륭해서 기분이 좋습니다. 옷이 항상 깨끗하고 정갈하게 정리되어 돌아오니 믿고 맡길 수 있습니다. 매번 기대 이상의 서비스를 제공해주셔서 감사드리고, 앞으로도 이곳을 이용할 것입니다. 매우 추천합니다!",
	"세탁 후 옷이 새것처럼 변했어요. 너무 감사합니다! 세탁 전후 차이가 확실해서 믿고 맡길 수 있습니다. 직원분들도 항상 친절하게 맞아주셔서 기분 좋게 방문할 수 있습니다. 앞으로도 계속 이용할 예정입니다. 정말 감사드립니다!",
	"서울에서 가장 만족스러운 세탁소입니다. 옷을 맡기면 언제나 새것처럼 깨끗하게 돌아오고, 직원분들이 친절해서 좋습니다. 다양한 세탁 옵션과 합리적인 가격 덕분에 자주 이용하고 있습니다. 앞으로도 계속 이용할 계획입니다. 감사합니다!",
	"세탁물을 맡기면 항상 기대 이상의 결과를 얻습니다. 얼룩 하나 없이 말끔해진 옷을 보니 기분이 좋습니다. 특히 겨울 코트나 두꺼운 옷도 전혀 손상 없이 돌아와서 믿고 맡길 수 있습니다. 이런 세탁소를 만나게 되어 정말 다행입니다. 추천합니다!",
	"이 세탁소는 정말 최고입니다. 매번 옷이 새것처럼 돌아오고, 직원들의 친절함에 감동합니다. 다양한 세탁 옵션과 합리적인 가격 덕분에 늘 만족합니다. 바쁜 일정 속에서도 빠르고 정확한 서비스를 제공해 주셔서 고맙습니다. 다른 세탁소와는 비교할 수 없는 퀄리티에요!",
];

// Static ratings between 4 and 5 stars
const staticRatings = [
	4, 4.5, 5, 4.5, 4, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5,
	5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4,
	4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5, 5, 4, 4.5,
];

// Static image paths with arrays of 2-4 images per review
const staticImages = [
	[
		"/assets/images/laundry-pic-5.jpg",
		"/assets/images/laundry-pic-6.jpg",
	],
	[
		"/assets/images/laundry-pic-7.jpg",
		"/assets/images/laundry-pic-8.jpg",
	],
	[
		"/assets/images/laundry-pic-9.jpg",
		"/assets/images/laundry-pic-10.jpg",
		"/assets/images/laundry-pic-11.jpg",
	],
	[
		"/assets/images/laundry-pic-12.jpg",
		"/assets/images/laundry-pic-13.jpg",
	],
	[
		"/assets/images/laundry-pic-14.jpg",
		"/assets/images/laundry-pic-15.jpg",
	],
	[
		"/assets/images/laundry-pic-16.jpg",
		"/assets/images/laundry-pic-17.jpg",
		"/assets/images/laundry-pic-18.jpg",
	],
	[
		"/assets/images/laundry-pic-19.jpg",
		"/assets/images/laundry-pic-20.jpg",
	],
	[
		"/assets/images/laundry-pic-21.jpg",
		"/assets/images/laundry-pic-22.jpg",
		"/assets/images/laundry-pic-23.jpg",
		"/assets/images/laundry-pic-24.jpg",
	],
	[
		"/assets/images/laundry-pic-25.jpg",
		"/assets/images/laundry-pic-5.jpg",
	],
	[
		"/assets/images/laundry-pic-6.jpg",
		"/assets/images/laundry-pic-7.jpg",
	],
	[
		"/assets/images/laundry-pic-8.jpg",
		"/assets/images/laundry-pic-9.jpg",
		"/assets/images/laundry-pic-10.jpg",
	],
	[
		"/assets/images/laundry-pic-11.jpg",
		"/assets/images/laundry-pic-12.jpg",
	],
	[
		"/assets/images/laundry-pic-13.jpg",
		"/assets/images/laundry-pic-14.jpg",
	],
	[
		"/assets/images/laundry-pic-15.jpg",
		"/assets/images/laundry-pic-16.jpg",
		"/assets/images/laundry-pic-17.jpg",
	],
	[
		"/assets/images/laundry-pic-18.jpg",
		"/assets/images/laundry-pic-19.jpg",
	],
	[
		"/assets/images/laundry-pic-20.jpg",
		"/assets/images/laundry-pic-21.jpg",
		"/assets/images/laundry-pic-22.jpg",
	],
	[
		"/assets/images/laundry-pic-23.jpg",
		"/assets/images/laundry-pic-24.jpg",
	],
	[
		"/assets/images/laundry-pic-25.jpg",
		"/assets/images/laundry-pic-5.jpg",
	],
	[
		"/assets/images/laundry-pic-6.jpg",
		"/assets/images/laundry-pic-7.jpg",
	],
	[
		"/assets/images/laundry-pic-8.jpg",
		"/assets/images/laundry-pic-9.jpg",
		"/assets/images/laundry-pic-10.jpg",
	],
	[
		"/assets/images/laundry-pic-11.jpg",
		"/assets/images/laundry-pic-12.jpg",
	],
	[
		"/assets/images/laundry-pic-13.jpg",
		"/assets/images/laundry-pic-14.jpg",
	],
	[
		"/assets/images/laundry-pic-15.jpg",
		"/assets/images/laundry-pic-16.jpg",
		"/assets/images/laundry-pic-17.jpg",
	],
	[
		"/assets/images/laundry-pic-18.jpg",
		"/assets/images/laundry-pic-19.jpg",
	],
	[
		"/assets/images/laundry-pic-20.jpg",
		"/assets/images/laundry-pic-21.jpg",
		"/assets/images/laundry-pic-22.jpg",
	],
	[
		"/assets/images/laundry-pic-23.jpg",
		"/assets/images/laundry-pic-24.jpg",
	],
	[
		"/assets/images/laundry-pic-25.jpg",
		"/assets/images/laundry-pic-5.jpg",
	],
	[
		"/assets/images/laundry-pic-6.jpg",
		"/assets/images/laundry-pic-7.jpg",
	],
	[
		"/assets/images/laundry-pic-8.jpg",
		"/assets/images/laundry-pic-9.jpg",
		"/assets/images/laundry-pic-10.jpg",
	],
	[
		"/assets/images/laundry-pic-11.jpg",
		"/assets/images/laundry-pic-12.jpg",
	],
	[
		"/assets/images/laundry-pic-13.jpg",
		"/assets/images/laundry-pic-14.jpg",
	],
	[
		"/assets/images/laundry-pic-15.jpg",
		"/assets/images/laundry-pic-16.jpg",
		"/assets/images/laundry-pic-17.jpg",
	],
	[
		"/assets/images/laundry-pic-18.jpg",
		"/assets/images/laundry-pic-19.jpg",
	],
	[
		"/assets/images/laundry-pic-20.jpg",
		"/assets/images/laundry-pic-21.jpg",
		"/assets/images/laundry-pic-22.jpg",
	],
	[
		"/assets/images/laundry-pic-23.jpg",
		"/assets/images/laundry-pic-24.jpg",
	],
	[
		"/assets/images/laundry-pic-25.jpg",
		"/assets/images/laundry-pic-5.jpg",
	],
	[
		"/assets/images/laundry-pic-6.jpg",
		"/assets/images/laundry-pic-7.jpg",
	],
	[
		"/assets/images/laundry-pic-8.jpg",
		"/assets/images/laundry-pic-9.jpg",
		"/assets/images/laundry-pic-10.jpg",
	],
];

// The Reviews component
const Reviews: React.FC = () => {
  const [reviewsData, setReviewsData] = useState<Review[]>(
    Array.from({ length: 50 }, (_, index) => ({
      reviewerName: staticPhoneNumbers[index],
      reviewDate: staticDates[index],
      laundromatName: laundromatNames[index % laundromatNames.length],
      laundromatType: laundromatTypes[index % laundromatTypes.length],
      rating: staticRatings[index % staticRatings.length],
      text: reviewTexts[index % reviewTexts.length],
      images: staticImages[index % staticImages.length],
    }))
  );

  const { isLoggedIn } = useAuth(); // Get the authentication state

  // Handling new reviews
  const handleNewReview = (reviewData: {
    rating: number;
    reviewText: string;
    uploadedImages: string[];
  }) => {
    const newReview: Review = {
      reviewerName: "010-00******", // Placeholder
      reviewDate: new Date().toISOString().slice(0, 10),
      laundromatName: "서울 랜덤 세탁소",
      laundromatType: laundromatTypes[Math.floor(Math.random() * laundromatTypes.length)],
      rating: reviewData.rating,
      text: reviewData.reviewText,
      images: reviewData.uploadedImages,
    };

    // Adding the new review to the top of the list
    setReviewsData((prevReviews) => {
      const updatedReviews = [newReview, ...prevReviews];
      return updatedReviews.sort((a, b) => {
        const dateA = new Date(a.reviewDate);
        const dateB = new Date(b.reviewDate);
        return dateB.getTime() - dateA.getTime();
      });
    });
  };

  return (
    <div>
      {isLoggedIn && (
        <ReviewForm onSubmit={handleNewReview} isLoggedIn={isLoggedIn} />
      )}

      {reviewsData.map((review, index) => (
        <ReviewPage
          key={index}
          isEditable={false}
          initialRating={review.rating}
          initialText={review.text}
          initialImages={review.images}
          reviewerName={review.reviewerName}
          reviewDate={review.reviewDate}
          laundromatName={`${review.laundromatName} ${review.laundromatType}`}
        />
      ))}
    </div>
  );
};

export default Reviews;