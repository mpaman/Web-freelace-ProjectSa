import React, { useState, useEffect } from 'react';
import { Button, Card, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { GetPostworkById } from '../../../../services/https/index';
import axios from 'axios';

const { Dragger } = Upload;

const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'http://localhost:8000/upload',
    onChange(info) {
        const { status } = info.file;
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            // Save the file link in the state for submission
            setFileLink(info.file.response.file_url);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const Sent: React.FC = () => {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const [postwork, setPostwork] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [messageApi] = message.useMessage();
    const [fileLink, setFileLink] = useState<string | null>(null);

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

    const handleAccept = async () => {
        if (fileLink) {
            try {
                const res = await axios.post(`http://localhost:8000/submissions/${postId}`, {
                    file_link: fileLink,
                });
                if (res.status === 200) {
                    messageApi.open({
                        type: "success",
                        content: "Submission successful!",
                    });
                    navigate('/getmon'); // Navigate to Sent page on success
                } else {
                    messageApi.open({
                        type: "error",
                        content: "Submission failed",
                    });
                }
            } catch (error) {
                messageApi.open({
                    type: "error",
                    content: "Error creating submission",
                });
            }
        } else {
            messageApi.open({
                type: "error",
                content: "No file uploaded",
            });
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
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
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
