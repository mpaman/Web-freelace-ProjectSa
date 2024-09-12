export interface BookingInterface {
    id: string; // Unique identifier for the booking
    workId: number; // ID of the work/job being booked
    bookerUserId: number; // ID of the user who made the booking
    posterUserId: number; // ID of the user who posted the job
    status: 'pending' | 'accepted' | 'rejected'; // Current status of the booking
}
