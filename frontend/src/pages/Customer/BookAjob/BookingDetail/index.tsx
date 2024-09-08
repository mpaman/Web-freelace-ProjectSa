import React, { useState, useEffect } from 'react';
import { Button, Card, Space, message, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { GetBookingById, UpdateBookingStatus } from '../../../../services/https/index'; // Import your service functions
import { BookingInterface } from '../../../../interfaces/Booking'; // Define this interface accordingly

const BookingDetail: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>(); // Get bookingId from URL params
    const navigate = useNavigate();
    const [booking, setBooking] = useState<BookingInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [messageApi] = message.useMessage();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await GetBookingById(bookingId);
                if (res.status === 200) {
                    setBooking(res.data);
                } else {
                    messageApi.open({
                        type: 'error',
                        content: 'Failed to load booking details',
                    });
                }
            } catch (error) {
                messageApi.open({
                    type: 'error',
                    content: 'Error fetching booking details',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handleAccept = async () => {
        try {
            const res = await UpdateBookingStatus(bookingId, 'accepted');
            if (res.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: 'Booking accepted',
                });
                navigate('/managebooking');
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Failed to accept booking',
                });
            }
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: 'Error accepting booking',
            });
        }
    };

    const handleReject = async () => {
        try {
            const res = await UpdateBookingStatus(bookingId, 'rejected');
            if (res.status === 200) {
                messageApi.open({
                    type: 'success',
                    content: 'Booking rejected',
                });
                navigate('/managebooking');
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Failed to reject booking',
                });
            }
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: 'Error rejecting booking',
            });
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Card title="Booking Details" style={{ width: '100%' }}>
                <p><strong>Booking ID:</strong> {booking?.id}</p>
                <p><strong>User:</strong> {booking?.userName}</p>
                <p><strong>Post ID:</strong> {booking?.postId}</p>
                <p><strong>Details:</strong> {booking?.details}</p>
                <p><strong>Status:</strong> {booking?.status}</p>
                
                <Space style={{ marginTop: '20px' }}>
                    <Button type="primary" onClick={handleAccept}>
                        Accept
                    </Button>
                    <Button type="default" danger onClick={handleReject}>
                        Reject
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default BookingDetail;
