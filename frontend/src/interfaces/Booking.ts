export interface BookingInterface {
    ID: number;
    poster_user_id: number;
    work_id: number;
    booker_user_id: number;
    status: 'pending' | 'accepted' | 'rejected';
    booking_date: string;
    User?: {
        first_name: string;
        last_name: string;
    };
    Work?: {
        info: string;
    };
}
