"use client";
import { useState, useEffect } from "react";

interface UseReviewProps {
  initialRating?: number;
  initialText?: string;
  initialImages?: string[];
}

export const useReview = ({
  initialRating = 0,
  initialText = "",
  initialImages = [],
}: UseReviewProps) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [rating, setRating] = useState<number>(Math.round(initialRating));
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState(initialText);
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

  const handleUpload = ({ fileList }: { fileList: any[] }) => {
    setUploadedImages(
      fileList.map((file) => URL.createObjectURL(file.originFileObj))
    );
  };

  const toggleTextExpansion = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  const showModal = (image: string) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return {
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
  };
};
