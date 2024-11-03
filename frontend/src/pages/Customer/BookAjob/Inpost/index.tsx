import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Space, message, Typography, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, MoneyCollectOutlined, FileTextOutlined } from "@ant-design/icons";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GetPostworkById, GetUserProfile } from "../../../../services/https/index";
import axios from 'axios';
import videoBg from "../../../../assets/back.mp4";
const { Title, Paragraph } = Typography;

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [postwork, setPostwork] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [bookerUserId, setBookerUserId] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);  // Use to store the profile

    const fetchUserProfile = async () => {
        try {
            const profileRes = await GetUserProfile();
            setProfile(profileRes);  // Update profile state
            setBookerUserId(profileRes.ID || "No ID");
        } catch (error) {
            if (error instanceof Error) {
                messageApi.open({
                    type: "error",
                    content: error.message || "Failed to fetch user profile",
                });
            } else {
                messageApi.open({
                    type: "error",
                    content: "An unknown error occurred",
                });
            }
        }
    };

    const isValidURL = (urlString: string) => {
        try {
            new URL(urlString);
            return true;
        } catch {
            return false;
        }
    };

    // ตรวจสอบว่า postId มีค่าหรือไม่ก่อนที่จะ fetch data
    useEffect(() => {
        if (!postId) {
            messageApi.open({
                type: "error",
                content: "Invalid post ID",
            });
            return;
        }

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
                if (axios.isAxiosError(error)) {
                    messageApi.open({
                        type: "error",
                        content: error.response?.data?.error || "Error fetching post details",
                    });
                } else {
                    messageApi.open({
                        type: "error",
                        content: "An unknown error occurred",
                    });
                }
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
                    message.success("Booking already accepted, proceeding to the next page.");
                    navigate(`/post/${postId}/sent`);
                } else {
                    message.success("Booking successful!");
                }
            }
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response &&
                error.response.status === 400 &&
                error.response.data.error === "This user has already booked this job"
            ) {
                message.error("You have already booked this job.");
            } else if (axios.isAxiosError(error)) {
                message.error("You cannot book your own job.");
            } else {
                message.error("An unknown error occurred while booking the job.");
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {contextHolder}
            {/* Background video */}
            <video
                autoPlay
                loop
                muted
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                    filter: "brightness(0.6)",
                }}
            >
                <source src={videoBg} type="video/mp4" />
            </video>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '60%' }}>
                    <Card style={{ width: '100%', height: '600px', overflowY: 'auto' }}>
                        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                            <FileTextOutlined style={{ marginRight: '8px' }} />
                            {postwork?.Work?.info || 'No info'}
                        </Paragraph>
                    </Card>
                </div>

                <div style={{ width: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Card style={{ marginBottom: '20px' }}>
                        <Space size="large" align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                            <Link to={`/customer/profile/${postwork.User?.ID}`} state={{ info: postwork.Work?.info || '' }}>
                                <Avatar
                                    src={postwork?.User?.Profile || undefined}
                                    size={100}
                                    icon={<UserOutlined />}
                                    style={{ cursor: 'pointer' }}
                                />
                            </Link>
                            <Typography.Text strong>
                                {postwork?.User?.first_name} {postwork?.User?.last_name}
                            </Typography.Text>
                        </Space>
                    </Card>

                    <Card style={{ height: '300px', overflowY: 'auto' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={4}>
                                <PhoneOutlined /> Contact
                            </Title>
                            <Paragraph>
                                {isValidURL(postwork?.Work?.contact) ? (
                                    <a href={postwork.Work.contact} target="_blank" rel="noopener noreferrer">
                                        GO TO CONTACT
                                    </a>
                                ) : (
                                    postwork?.Work?.contact || 'No Contact Information'
                                )}
                            </Paragraph>
                            <Divider />
                            <Title level={4}>
                                <MoneyCollectOutlined /> Wages
                            </Title>
                            <Paragraph>
                                {postwork?.Work?.wages || 'No Wages Information'} บาท
                            </Paragraph>
                        </div>
                    </Card>

                    {/* Display "Book Job" button only if profile is loaded and the role is "FREELANCE" */}
                    {profile && profile.Role === "FREELANCE" && (
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
                            <Button type="primary" size="large" onClick={handleBookJob}>Book Job</Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PostPage;
