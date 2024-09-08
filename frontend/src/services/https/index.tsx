import { UsersInterface } from "../../interfaces/IUser";
import { SignInInterface } from "../../interfaces/SignIn";
import { WorkInterface } from "../../interfaces/work";
import { PostworkInterface } from "../../interfaces/Postwork";
import axios from "axios";

const apiUrl = "http://localhost:8000"; 


// Create requestOptions for each API call
function getRequestOptions() {
    const Authorization = localStorage.getItem("token");
    const Bearer = localStorage.getItem("token_type");

    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `${Bearer} ${Authorization}`,
        },
    };
}

async function SignIn(data: SignInInterface) {
    return await axios
        .post(`${apiUrl}/signin`, data, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetUsers() {
    return await axios
        .get(`${apiUrl}/users`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetWork() {
    return await axios
        .get(`${apiUrl}/works`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetPostwork() {
    return await axios
        .get(`${apiUrl}/postworks`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetUsersById(id: string) {
    return await axios
        .get(`${apiUrl}/user/${id}`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetWorkById(id: string) {
    return await axios
        .get(`${apiUrl}/work/${id}`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function GetPostworkById(id: string) {
    return await axios
        .get(`${apiUrl}/postwork/${id}`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}
// Get booking details by ID
async function GetBookingById(id: string) {
    return await axios
        .get(`${apiUrl}/booking/${id}`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

// Update booking status
async function UpdateBookingStatus(id: string, status: 'accepted' | 'rejected') {
    return await axios
        .put(`${apiUrl}/booking/${id}/status`, { status }, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function UpdateUsersById(id: string, data: UsersInterface) {
    return await axios
        .put(`${apiUrl}/user/${id}`, data, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function UpdateWorkById(id: string, data: WorkInterface) {
    return await axios
        .put(`${apiUrl}/work/${id}`, data, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function DeleteUsersById(id: string) {
    return await axios
        .delete(`${apiUrl}/user/${id}`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function DeleteWorkById(id: string) {
    return await axios
        .delete(`${apiUrl}/work/${id}`, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function CreateUser(data: UsersInterface) {
    return await axios
        .post(`${apiUrl}/signup`, data, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

async function CreateWork(data: WorkInterface) {
    return await axios
        .post(`${apiUrl}/work`, data, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

// New Functions for Booking Management

// Create a new booking
async function BookJob(postId: string) {
    return await axios
        .post(`${apiUrl}/bookings`, { postId }, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

// Accept a booking
async function AcceptBooking(bookingId: string) {
    return await axios
        .put(`${apiUrl}/bookings/${bookingId}/accept`, {}, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

// Reject a booking
async function RejectBooking(bookingId: string) {
    return await axios
        .put(`${apiUrl}/bookings/${bookingId}/reject`, {}, getRequestOptions())
        .then((res) => res)
        .catch((e) => e.response);
}

export {
    SignIn,
    GetUsers,
    GetUsersById,
    UpdateUsersById,
    DeleteUsersById,
    CreateUser,
    GetWork,
    GetWorkById,
    UpdateWorkById,
    DeleteWorkById,
    CreateWork,
    GetPostwork,
    GetPostworkById,
    BookJob,
    AcceptBooking,
    RejectBooking,
};