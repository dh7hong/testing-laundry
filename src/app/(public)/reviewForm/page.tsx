import React, { useState } from 'react';
import { Form, Input, Rate, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

interface ReviewFormProps {
  onSubmit: (reviewData: { rating: number; reviewText: string; uploadedImages: string[] }) => void;
  isLoggedIn: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoggedIn }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleFileChange = ({ fileList }: any) => setFileList(fileList);

  const handleFinish = async (values: any) => {
    if (!isLoggedIn) {
      message.error('You must be logged in to submit a review.');
      return;
    }

    try {
      // Upload images and get URLs
      const imageUrls = await Promise.all(
        fileList.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file.originFileObj);

          const response = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          return response.data.url; // Assuming the server returns the uploaded image URL
        })
      );

      onSubmit({ ...values, uploadedImages: imageUrls });
      form.resetFields();
      setFileList([]);
      message.success('Review submitted successfully!');
    } catch (error) {
      message.error('Failed to submit review.');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item name="rating" label="Rating" rules={[{ required: true, message: 'Please select a rating' }]}>
        <Rate />
      </Form.Item>
      <Form.Item
        name="reviewText"
        label="Review"
        rules={[{ required: true, message: 'Please write a review' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Upload Images">
        <Upload
          fileList={fileList}
          beforeUpload={() => false} // Prevent auto-upload
          onChange={handleFileChange}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Review
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm;
