import axios from 'axios';
import { UsersInterface } from '../../interfaces/IUser';
import { SignInInterface } from '../../interfaces/SignIn';
import { WorkInterface } from '../../interfaces/work';
import { BookingInterface } from '../../interfaces/Booking';
import { PostworkInterface } from "../../interfaces/Postwork";
import { ResumeInterface } from "../../interfaces/IResume";

const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
    },
};

async function SignIn(data: SignInInterface) {
    return await axios
        .post(`${apiUrl}/signin`, data, requestOptions)
        .then((res) => {
            // เก็บ resume_id ใน localStorage
            localStorage.setItem("resume_id", res.data.resume_id);
            return res;
        })
        .catch((e) => e.response);
}

async function GetUsers() {
    return await axios
        .get(`${apiUrl}/users`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function GetUserById(id: string) {
    return await axios
        .get(`${apiUrl}/user/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function UpdateUsersById(id: string, data: UsersInterface) {
    return await axios
        .put(`${apiUrl}/user/${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function DeleteUsersById(id: string) {
    return await axios
        .delete(`${apiUrl}/user/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function CreateUser(data: UsersInterface) {
    return await axios
        .post(`${apiUrl}/signup`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
export const GetUserProfile = async (): Promise<any> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    try {
        const response = await fetch(`${apiUrl}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch user profile");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};


async function CreateWork(data: WorkInterface) {
    return await axios
        .post(`${apiUrl}/works`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetWorkById(id: string) {
    return await axios
        .get(`${apiUrl}/work/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetWork() {
    return await axios
        .get(`${apiUrl}/works`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetPostwork() {
    return await axios
        .get(`${apiUrl}/postworks`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function GetPostworkById(id: string) {
    return await axios
        .get(`${apiUrl}/postwork/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function DeletePostworkById(id: string) {
    return await axios
        .delete(`${apiUrl}/postwork/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function DeleteWorkById(id: string) {
    return await axios
        .delete(`${apiUrl}/work/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}


//Booking

export const GetBookingsByWorkID = async (workID: string) => {
    return await axios
        .get(`${apiUrl}/works/${workID}/bookings`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function CreateBooking(data: BookingInterface) {
    return await axios
        .post(`${apiUrl}/booking`, data, requestOptions) // Use singular 'booking'
        .then((res) => res)
        .catch((e) => e.response);
}




async function GetSubmissions() {
    return await axios
        .get(`${apiUrl}/submissions`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
export const GetSubmissionsByWorkID = async (workID: string) => {
    return await axios
        .get(`${apiUrl}/works/${workID}/submissions`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function UpdateWorkById(id: string, data: WorkInterface) {
    return await axios
        .put(`${apiUrl}/work/${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function UpdateBookingStatus(bookingId: number, status: string) {
    return await axios
        .put(`${apiUrl}/works/bookings/${bookingId}`, { status }, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetAllBookings() {
    return await axios
        .get(`${apiUrl}/bookings`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}




async function UpdateResumeById(id: string, data: ResumeInterface) {
    return await axios
        .put(`${apiUrl}/resumes/${id}`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function DeleteResumeById(id: string) {
    return await axios
        .delete(`${apiUrl}/resumes/${id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function CreateResume(data: ResumeInterface) {
    return await axios
        .post(`${apiUrl}/resumes`, data, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function GetResumeById(resume_id: string) {
    return await axios
        .get(`${apiUrl}/resumes/${resume_id}`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}


async function GetResume() {
    return await axios
        .get(`${apiUrl}/resumes`, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
}
async function GetRatings() {
    return await axios
        .get(`${apiUrl}/Rating`, requestOptions) // Endpoint สำหรับดึงคะแนน
        .then((res) => res)
        .catch((e) => e.response);
}

// ฟังก์ชันสำหรับดึงคะแนนตาม ID
async function GetRatingById(id: number) {
    return await axios
        .get(`${apiUrl}/Rating/${id}`, requestOptions) // Endpoint สำหรับดึงคะแนนตาม ID
        .then((res) => res)
        .catch((e) => e.response);
}


// ฟังก์ชันสำหรับดึงข้อมูลการชำระเงิน
async function GetPayments() {
    return await axios
        .get(`${apiUrl}/Payment`, requestOptions) // Endpoint สำหรับดึงข้อมูลการชำระเงิน
        .then((res) => res)
        .catch((e) => e.response);
}

// ฟังก์ชันสำหรับดึงการชำระเงินตาม ID
async function GetPaymentById(id: number) {
    return await axios
        .get(`${apiUrl}/Payment/${id}`, requestOptions) // Endpoint สำหรับดึงการชำระเงินตาม ID
        .then((res) => res)
        .catch((e) => e.response);
}

const GetWagesByWorkID = async (workID: number) => {
    try {
        const res = await axios.get(`${apiUrl}/works/${workID}`, requestOptions);
        console.log("Wages response:", res.data); // ตรวจสอบโครงสร้าง response
        // แก้ไขจาก res.data.Wages เป็น res.data.wages ตามข้อมูลที่ได้มา
        if (res.data && res.data.wages) {
            return res.data.wages;
        } else {
            throw new Error("Wages not found in response");
        }
    } catch (e) {
        console.error("Error fetching wages:", e);
        return null; // คืนค่า null หรือ handle error ตามต้องการ
    }
};

export const CreatePayment = async (paymentData: any) => {
    return await axios
        .post(`${apiUrl}/Payment`, paymentData, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
};

// Rating Management
export const CreateRating = async (ratingData: any) => {
    return await axios
        .post(`${apiUrl}/Rating`, ratingData, requestOptions)
        .then((res) => res)
        .catch((e) => e.response);
};
export {
    SignIn,


    GetResume,
    UpdateResumeById,
    DeleteResumeById,
    GetResumeById,


    CreateResume,
    GetAllBookings,
    GetSubmissions,
    UpdateBookingStatus,
    GetUsers,
    UpdateUsersById,
    DeleteUsersById,
    CreateUser,
    GetUserById,
    GetWorkById,
    GetWork,
    UpdateWorkById,
    DeleteWorkById,
    CreateWork,
    GetPostwork,
    GetPostworkById,
    DeletePostworkById,
    CreateBooking,

    GetRatings,
    GetRatingById,
    GetPayments,
    GetPaymentById,
    GetWagesByWorkID
};
