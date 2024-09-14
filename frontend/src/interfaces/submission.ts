export interface SubmissionInterface {
    id: string;
    poster_user_id: number;
    work_id: number;
    booker_user_id: number;
    submission_date: string;
    User?: {
        first_name: string;
        last_name: string;
    };
    Work?: {
        info: string;
        category: string;
        wages: number;
    };
    file_link: string;
}