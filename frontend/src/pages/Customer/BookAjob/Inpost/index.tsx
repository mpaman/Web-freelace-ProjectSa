import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Space, Carousel, message } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from 'react-router-dom';
import { GetPostworkById,GetUserProfile} from "../../../../services/https/index";
import axios from 'axios';

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [postwork, setPostwork] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [messageApi, contextHolder] = message.useMessage();
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
        fetchUserProfile()
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
            booker_user_id: bookerUserId,
            status: 'pending',
        };
    
        try {
            const res = await axios.post(`http://localhost:8000/postwork/${postId}/bookings`, bookingPayload);
            if (res.status === 200) {
                if (res.data.redirect) {
                    // ถ้าสถานะการจองเป็น accepted จะ redirect ไปยังหน้าถัดไป
                    message.success("Booking already accepted, proceeding to the next page.");
                    navigate(`/post/${postId}/sent`);
                } else {
                    // แสดงข้อความว่าการจองสำเร็จ แต่ไม่ Redirect
                    message.success("Booking successful!");
                    // ไม่ต้อง redirect ไปหน้าถัดไป เพื่อให้ผู้ใช้สามารถอยู่ที่หน้านี้
                }
            }
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.error === "This user has already booked this job"
            ) {
                message.error("You have already booked this job.");
            } else {
                message.error("Booking failed.");
            }
        }
    };
    



    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {contextHolder}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '60%' }}>
                    <Card style={{ width: '90%', height: '600px', overflowY: 'auto' }}>
                        <div style={{ whiteSpace: 'pre-wrap', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>
                            {postwork?.Work?.info || 'No info'}
                        </div>
                    </Card>
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
                            ค่าจ้าง: {postwork?.Work?.wages || 'No Wages Information'} บาท
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