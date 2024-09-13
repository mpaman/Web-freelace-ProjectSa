import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Space, Carousel, message } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from 'react-router-dom';
import { GetPostworkById } from "../../../../services/https/index";
import axios from 'axios';

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [postwork, setPostwork] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [messageApi, contextHolder] = message.useMessage();

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

    const handleBookJob = async () => {
        const bookingPayload = {
            work_id: postwork?.Work?.ID,
            poster_user_id: postwork?.User?.ID,
            booker_user_id: 123, // Replace with actual user ID from context
            status: 'pending'
        };

        try {
            const res = await axios.post(`http://localhost:8000/postwork/${postId}/bookings`, bookingPayload);
            if (res.status === 201) {
                messageApi.open({
                    type: "success",
                    content: "Booking created successfully",
                });
                navigate(`/post/${postId}/sent`);
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            messageApi.open({
                type: "error",
                content: "Error creating booking",
            });
        }
        navigate(`/post/${postId}/sent`);
    };



    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {contextHolder}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '60%' }}>
                    <Card style={{ width: '90%', height: '80px', overflowY: 'auto' }}>
                        <div style={{ whiteSpace: 'pre-wrap', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
                            {postwork?.Work?.info || 'No info'}
                        </div>
                    </Card>
                    <Carousel autoplay style={{ width: '90%', height: '600px', overflowY: 'auto' }}>
                        {postwork?.Work?.images?.map((image: string, index: number) => (
                            <div key={index}>
                                <img src={image} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '100%' }} />
                            </div>
                        ))}
                    </Carousel>
                </div>

                <div style={{ width: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Space wrap size={16}>
                        <Avatar size="large" icon={<UserOutlined />} />
                        {postwork?.User?.first_name} {postwork?.User?.last_name}
                    </Space>

                    <Card style={{ width: '50%', height: '200px', overflowY: 'auto', marginTop: '20px' }}>
                        <div style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                            ติดต่อ: {postwork?.Work?.contact || 'No Contact Information'}
                            <br />
                            ค่าจ้าง: {postwork?.Work?.wages || 'No Wages Information'}
                        </div>
                    </Card>

                    <div style={{
                        position: 'fixed',
                        bottom: '70px',
                        right: '150px',
                        zIndex: 1000,
                        backgroundColor: '#fff',
                        padding: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Button type="primary" onClick={handleBookJob}>Book Job</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostPage;