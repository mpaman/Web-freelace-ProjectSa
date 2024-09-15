import React, { useState, useEffect } from 'react';
import { Button, Card, message, Input, Typography, Space } from 'antd';
import { FileOutlined, PhoneOutlined, MoneyCollectOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from 'react-router-dom';
import { GetPostworkById, GetUserProfile } from '../../../../services/https/index';
import axios from 'axios';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const Sent: React.FC = () => {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const [postwork, setPostwork] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [messageApi] = message.useMessage();
    const [fileLink, setFileLink] = useState<string | null>(null);
    const [bookerUserId, setBookerUserId] = useState<string | null>(null);

    const fetchUserProfile = async () => {
        try {
            const profileRes = await GetUserProfile();
            setBookerUserId(profileRes.ID || "No ID");
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Failed to fetch user profile",
            });
        }
    };

    useEffect(() => {
        fetchUserProfile();
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
        if (bookerUserId && fileLink) {
            try {
                const submissionPayload = {
                    work_id: postwork?.Work?.ID,
                    poster_user_id: postwork?.User?.ID,
                    booker_user_id: bookerUserId,
                    file_link: fileLink,
                };
    
                const res = await axios.post(`http://localhost:8000/postwork/${postId}/sent`, submissionPayload);
    
                if (res.status === 200) {
                    message.success("Submission successful!");
                    navigate(`/post/${postId}`);
                } else {
                    message.error("Submission failed");
                }
            } catch (error) {
                message.error("Error creating submission");
            }
        } else {
            message.error("No file link provided");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '60%' }}>
                {/* Job Details */}
                <Card style={{ width: '100%', height: 'auto', marginBottom: '20px', overflowY: 'auto' }}>
                    <Title level={3} style={{ textAlign: 'center', marginBottom: '10px' }}>
                        Job Details
                    </Title>
                    <Paragraph style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                        <FileOutlined style={{ marginRight: '8px' }} />
                        {postwork?.Work?.info || 'No job details available'}
                    </Paragraph>
                </Card>

                {/* Contact and Wages Details */}
                <Card style={{ width: '100%', height: 'auto', overflowY: 'auto' }}>
                    <Title level={4} style={{ textAlign: 'center', marginBottom: '10px' }}>
                        Contact & Wages
                    </Title>
                    <Paragraph style={{ whiteSpace: 'pre-wrap', textAlign: 'center' }}>
                        <PhoneOutlined style={{ marginRight: '8px' }} />
                        ติดต่อ: {postwork?.Work?.contact || 'No contact information available'}
                        <br />
                        <MoneyCollectOutlined style={{ marginRight: '8px' }} />
                        ค่าจ้าง: {postwork?.Work?.wages || 'No wage information available'} บาท
                    </Paragraph>
                </Card>
            </div>

            <div style={{ width: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* File Link Input Section */}
                <div style={{ marginBottom: '20px' }}>
                    <Title level={4} style={{ marginBottom: '10px' }}>
                        Upload File Link
                    </Title>
                    <TextArea
                        rows={4}
                        placeholder="ใส่ลิงก์ไฟล์ที่นี่"
                        value={fileLink || ''}
                        onChange={(e) => setFileLink(e.target.value)}
                        prefix={<UploadOutlined />}
                    />
                </div>

                {/* Send Job Button */}
                <div style={{
                    position: 'fixed',
                    bottom: '70px',
                    right: '30px',
                    zIndex: 1000,
                    backgroundColor: '#fff',
                    padding: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px'
                }}>
                    <Button type="primary" size="large" onClick={handleAccept} style={{ width: '100%' }}>
                        ส่งงาน
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Sent;
