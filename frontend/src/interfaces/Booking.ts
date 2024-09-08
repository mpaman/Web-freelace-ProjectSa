export interface BookingInterface {
    id: string; // Unique identifier for the booking
    userId: string; // ID of the user who made the booking
    postId: string; // ID of the post/job being booked
    userName: string; // Name of the user who made the booking
    details: string; // Additional details about the booking
    status: 'pending' | 'accepted' | 'rejected'; // Current status of the booking
    createdAt: string; // Timestamp when the booking was created
    updatedAt: string; // Timestamp when the booking was last updated
}
