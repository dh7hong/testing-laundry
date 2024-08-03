"use client";
import React from "react";
import { Rate, Upload, Space, Input, Modal } from "antd";
import ChevronDownIcon from "@/assets/icons/main/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/main/chevron-up.svg";
import StarIcon from "@/assets/icons/main/star-icon.svg";
import Image from "next/image";
import { useReview } from "@/app/hooks/useReview";

const { TextArea } = Input;

interface ReviewPageProps {
	isEditable: boolean;
	initialRating?: number;
	initialText?: string;
	initialImages?: string[];
	reviewerName?: string;
	reviewDate?: string;
	laundromatName?: string;
	laundromatType?: string;
	onSubmit?: (reviewData: {
		rating: number;
		reviewText: string;
		uploadedImages: string[];
	}) => void;
}

const ReviewPage: React.FC<ReviewPageProps> = ({
	isEditable,
	initialRating,
	initialText,
	initialImages,
	reviewerName,
	reviewDate,
	laundromatName,
	laundromatType,
	onSubmit,
}) => {
	const {
		isTextExpanded,
		toggleTextExpansion,
		rating,
		handleRatingChange,
		loading,
		reviewText,
		handleTextChange,
		uploadedImages,
		handleUpload,
		isModalVisible,
		showModal,
		handleCancel,
		selectedImage,
	} = useReview({
		initialRating,
		initialText,
		initialImages,
	});

	const handleReviewSubmit = () => {
		if (onSubmit) {
			onSubmit({
				rating,
				reviewText,
				uploadedImages,
			});
		}
	};

	const Text = (
		<span className="text-label-2 font-medium text-label-neutral">
			{reviewText.slice(0, 60)}...
		</span>
	);
	const fullText = (
		<span className="text-label-2 font-medium text-label-neutral">
			{reviewText}
		</span>
	);

	const StarSkeleton = () => (
		<div className="flex items-center space-x-[8px]">
			{[...Array(5)].map((_, i) => (
				<StarIcon key={i} className="w-5 h-5 text-gray-300" />
			))}
		</div>
	);

	return (
		<div className="p-4 bg-white rounded-md border mx-auto relative border-line-neutral w-full mb-[75px]">
			<div className="flex justify-between items-start">
				<div className="flex flex-col">
					<div className="flex items-center mb-1">
						<Space size="middle">
							{loading ? (
								<StarSkeleton />
							) : isEditable ? (
								<Rate
									allowHalf
									defaultValue={rating}
									onChange={handleRatingChange}
									style={{ color: "#ffc107", fontSize: "20px" }}
								/>
							) : (
								<Rate
									allowHalf
									disabled
									value={rating}
									style={{ color: "#ffc107", fontSize: "20px" }}
								/>
							)}
						</Space>
					</div>
					<div className="">{reviewerName}</div>
				</div>
				<div className="text-label-alternative text-caption-2">
					{reviewDate}
				</div>
			</div>
			<div className="mt-2 text-label-alternative text-caption-1">
				{laundromatName} {laundromatType}
			</div>

			{isEditable ? (
				<>
					<TextArea
						value={reviewText}
						onChange={handleTextChange}
						className="mt-2"
						rows={4}
					/>
					<Upload
						listType="picture-card"
						fileList={uploadedImages.map((url, index) => ({
							uid: index.toString(),
							name: `image-${index}`,
							status: "done",
							url,
						}))}
						onChange={handleUpload}
						beforeUpload={() => false}
						multiple
					>
						{uploadedImages.length < 8 && "+ Upload"}
					</Upload>
					<button
						onClick={handleReviewSubmit}
						className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
					>
						Submit Review
					</button>
				</>
			) : (
				<div className="mt-2 flex">
					<div className="flex-1">
						{isTextExpanded ? fullText : Text}
						<button onClick={toggleTextExpansion}>
							{isTextExpanded ? (
								<ChevronUpIcon className="w-4 h-4 inline ml-1" />
							) : (
								<ChevronDownIcon className="w-4 h-4 inline ml-1" />
							)}
						</button>
					</div>
					{!isTextExpanded && uploadedImages.length > 0 && (
						<div
							className={`relative w-20 h-20 ml-4 cursor-pointer ${
								!uploadedImages[0] ? "bg-[#F7F7F8]" : ""
							}`}
							onClick={() => showModal(uploadedImages[0])}
						>
							{uploadedImages[0] && (
								<Image
									src={uploadedImages[0]}
									alt="First uploaded image"
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									style={{ objectFit: "cover" }}
									className="bg-[#F7F7F8]"
								/>
							)}
							<div className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs flex items-center justify-center w-6 h-6 rounded-md">
								{uploadedImages.length}
							</div>
						</div>
					)}
				</div>
			)}

			{isTextExpanded && uploadedImages.length > 0 && (
				<div
					className="mt-2 overflow-x-auto hide-scrollbar"
					style={{ whiteSpace: "nowrap" }}
				>
					<div className="flex">
						{uploadedImages.map((src, index) => (
							<div
								key={index}
								className="relative w-[100px] h-[80px] bg-gray-100 cursor-pointer"
								style={{
									flexShrink: 0,
									marginRight: index === 3 ? "10px" : "0",
								}}
								onClick={() => showModal(src)}
							>
								<Image
									src={src}
									alt={`Uploaded image ${index + 1}`}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									style={{ objectFit: "cover" }}
								/>
							</div>
						))}
					</div>
				</div>
			)}

			<Modal
				open={isModalVisible}
				footer={null}
				onCancel={handleCancel}
				centered
				closeIcon={null}
				width={300}
				styles={{
					body: {
						padding: 0,
						margin: 0,
					},
				}}
			>
				<Image
					src={selectedImage}
					alt="Selected image"
					width={300}
					height={300}
					style={{ objectFit: "cover" }}
					onClick={handleCancel}
				/>
			</Modal>
		</div>
	);
};

export default ReviewPage;
