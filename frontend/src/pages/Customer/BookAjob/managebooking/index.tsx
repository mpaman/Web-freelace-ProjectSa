import React, { useState, useEffect } from 'react';
import { Button, Card, message } from 'antd';
import { useParams } from 'react-router-dom';
import { GetPostworkById, AcceptBooking, RejectBooking } from "../../../../services/https/index";

const ManageBookings: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [postwork, setPostwork] = useState<any>(null);
    const [messageApi] = message.useMessage();

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
            }
        };

        fetchPostwork();
    }, [postId]);

    const handleAccept = async (bookingId: string) => {
        try {
            const res = await AcceptBooking(bookingId);
            if (res.status === 200) {
                messageApi.open({
                    type: "success",
                    content: "Booking accepted",
                });
                // Refresh the bookings or update state
                const updatedPostwork = await GetPostworkById(postId);
                setPostwork(updatedPostwork.data);
            } else {
                messageApi.open({
                    type: "error",
                    content: "Failed to accept booking",
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Error accepting booking",
            });
        }
    };

    const handleReject = async (bookingId: string) => {
        try {
            const res = await RejectBooking(bookingId);
            if (res.status === 200) {
                messageApi.open({
                    type: "success",
                    content: "Booking rejected",
                });
                // Refresh the bookings or update state
                const updatedPostwork = await GetPostworkById(postId);
                setPostwork(updatedPostwork.data);
            } else {
                messageApi.open({
                    type: "error",
                    content: "Failed to reject booking",
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Error rejecting booking",
            });
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Manage Bookings for Post ID: {postId}</h2>
            <Card title="Booking Requests">
                {postwork?.Bookings?.length > 0 ? (
                    postwork.Bookings.map((booking: any) => (
                        <Card key={booking.ID} style={{ marginBottom: '10px' }}>
                            <p>User: {booking.User?.first_name} {booking.User?.last_name}</p>
                            <p>Details: {booking.details}</p>
                            <Button type="primary" onClick={() => handleAccept(booking.ID)}>Accept</Button>
                            <Button type="danger" onClick={() => handleReject(booking.ID)} style={{ marginLeft: '10px' }}>Reject</Button>
                        </Card>
                    ))
                ) : (
                    <p>No bookings available</p>
                )}
            </Card>
        </div>
    );
};

export default ManageBookings;
