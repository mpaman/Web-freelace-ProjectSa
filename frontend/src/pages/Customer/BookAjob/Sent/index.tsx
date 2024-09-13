import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { GetPostworkById } from '../../../../services/https/index';
import axios from 'axios';

const { Dragger } = Upload;

const Sent: React.FC = () => {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const [postwork, setPostwork] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [messageApi] = message.useMessage();
    const [fileLink, setFileLink] = useState<string | null>(null);

    // Fetch postwork details
    useEffect(() => {
        const fetchPostwork = async () => {
            try {
                const res = await GetPostworkById(postId);
                if (res.status === 200) {
                    setPostwork(res.data);
                } else {
                    messageApi.open({
                        type: "error",
                        content: "Failed to load post details",
                    });
                }
            } catch (error) {
                messageApi.open({
                    type: "error",
                    content: "Error fetching post details",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPostwork();
    }, [postId, messageApi]);

    // File upload properties
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        action: 'http://localhost:8000/upload',
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} uploaded successfully.`);
                setFileLink(info.file.response.file_url); // Save the uploaded file link
            } else if (status === 'error') {
                message.error(`${info.file.name} upload failed.`);
            }
        },
    };

    // Handle submission
    const handleAccept = async () => {
        if (fileLink) {
            try {
                const submissionPayload = {
                    work_id: postwork?.Work?.ID,
                    poster_user_id: postwork?.User?.ID,
                    booker_user_id: 122, // ใส่ Booker User ID ที่แท้จริง
                    file_link: fileLink,
                };
    
                console.log("Payload:", submissionPayload);
    
                const res = await axios.post(`http://localhost:8000/postwork/${postId}/sent`, submissionPayload);
    
                console.log("Response from API:", res);
    
                if (res.status === 200) {
                    message.success("Submission successful!");
                } else {
                    message.error("Submission failed");
                }
            } catch (error) {
                console.error("Error from API:", error);
                message.error("Error creating submission");
            }
        } else {
            message.error("No file uploaded");
        }
    };
    
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '60%' }}>
                {/* Job Details */}
                <Card style={{ width: '90%', height: '600px', overflowY: 'auto' }}>
                    <div style={{ whiteSpace: 'pre-wrap', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
                        {postwork?.Work?.info || 'No job details available'}
                    </div>
                </Card>

                {/* Contact and Wages Details */}
                <Card style={{ width: '90%', height: '100px', overflowY: 'auto' }}>
                    <div style={{ whiteSpace: 'pre-wrap', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
                        ติดต่อ: {postwork?.Work?.contact || 'No contact information available'}
                        <br />
                        ค่าจ้าง: {postwork?.Work?.wages || 'No wage information available'}
                    </div>
                </Card>
            </div>

            <div style={{ width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* File Upload Section */}
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                    </p>
                </Dragger>

                {/* Send Job Button */}
                <div style={{
                    position: 'fixed',
                    bottom: '70px',
                    right: '150px',
                    zIndex: 1000,
                }}>
                    <Button type="primary" style={{ width: '100px' }} onClick={handleAccept}>
                        ส่งงาน
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Sent;
