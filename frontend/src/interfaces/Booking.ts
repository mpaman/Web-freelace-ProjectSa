export interface BookingInterface {
    id: string; // Unique identifier for the booking
    poster_user_id: number;
    work_id: number;
    booker_user_id: number;
    status: 'pending' | 'accepted' | 'rejected'; // Current status of the booking
    booking_date: string; // Date of booking in ISO format
    User?: {
        first_name: string;
        last_name: string;
    };
}