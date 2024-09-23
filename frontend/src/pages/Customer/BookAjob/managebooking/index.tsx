import { useState, useEffect } from "react";
import { Table, message, Spin, Select, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams, useNavigate } from "react-router-dom";
import { GetBookingsByWorkID, GetUserById, UpdateBookingStatus,GetWagesByWorkID} from "../../../../services/https/index";
import { BookingInterface } from "../../../../interfaces/Booking";
import { UsersInterface } from "../../../../interfaces/IUser"; // Interface ของผู้ใช้
import videoBg from "../../../../assets/back.mp4";
const { Option } = Select;

function ManageBooking() {
    const { workID } = useParams<{ workID: string }>();
    const [bookings, setBookings] = useState<BookingInterface[]>([]);
    const [users, setUsers] = useState<Record<number, UsersInterface>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [statusUpdates, setStatusUpdates] = useState<Record<number, string>>({});
    const navigate = useNavigate(); // ใช้สำหรับ navigate ไปหน้าอื่น

    const columns: ColumnsType<BookingInterface> = [
        // {
        //     title: "ID ผู้ใช้",
        //     dataIndex: "booker_user_id",
        //     key: "booker_user_id",
        // },
        {
            title: "ชื่อผู้จองงาน",
            key: "user_name",
            render: (record) => (
                <>
                    {users[record.booker_user_id]
                        ? `${users[record.booker_user_id].first_name} ${users[record.booker_user_id].last_name}`
                        : "ไม่ระบุ"}
                </>
            ),
        },
        {
            title: "ID งาน",
            key: "work_id",
            render: (record) => record.work_id,
        },
        {
            title: "สถานะการจอง",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <span>
                    {status === "pending" && "รอดำเนินการ"}
                    {status === "accepted" && "ยอมรับ"}
                    {status === "rejected" && "ปฏิเสธ"}
                </span>
            ),
        },
        {
            title: "อัปเดตสถานะ",
            key: "update_status",
            render: (record) => (
                <div>
                    <Select
                        defaultValue={record.status}
                        onChange={(value) => handleStatusChange(record.ID, value)}
                        style={{ width: 120 }}
                    >
                        <Option value="pending">รอดำเนินการ</Option>
                        <Option value="accepted">ยอมรับ</Option>
                        <Option value="rejected">ปฏิเสธ</Option>
                    </Select>
                    <Button
                        type="primary"
                        onClick={() => handleSubmitStatusUpdate(record.ID)}
                        style={{ marginLeft: "10px" }}
                    >
                        อัปเดต
                    </Button>
                </div>
            ),
        },
        {
            title: "โปรไฟล์ผู้ใช้",
            key: "view_profile",
            render: (record) => (
                <Button type="link" onClick={() => handleViewProfile(record.booker_user_id)}>
                    ดูโปรไฟล์
                </Button>
            ),
        },
        // {
        //     title: "ชำระเงิน",
        //     key: "payment_action",
        //     render: (record) => (
        //         <Button
        //             type="primary"
        //             onClick={() => handlePayment(record)}
        //             disabled={!record.file_link} // Disable if there's no file link
        //         >
        //             ชำระเงิน
        //         </Button>
        //     ),
        // },
    ];

    // const handlePayment = async (record: BookingInterface) => {
    //     const { work_id, booker_user_id, poster_user_id } = record;
    
    //     try {
    //         // เรียกใช้ GetWagesByWorkID เพื่อดึงค่าจ้าง
    //         const wages = await GetWagesByWorkID(work_id);
    
    //         if (wages !== null) {
    //             // ถ้าได้ค่าจ้างมาแล้ว จะแสดง message และนำทางไปที่หน้า payment พร้อมส่งข้อมูลทั้งหมดไป
    //             console.log(`Navigating to /payment with workId: ${work_id}, bookerUserId: ${booker_user_id}, posterUserId: ${poster_user_id}, wages: ${wages}`);
    //             messageApi.open({
    //                 type: "info",
    //                 content: `กำลังนำไปสู่หน้าชำระเงินสำหรับงาน ID: ${work_id} โดยผู้ใช้ ID: ${booker_user_id}`,
    //             });
    //             navigate('/payment', {
    //                 state: {
    //                     workId: work_id,
    //                     bookerUserId: booker_user_id,
    //                     posterUserId: poster_user_id,
    //                     wages: wages, // ส่ง wages ไปด้วย
    //                 },
    //             });
    //         } else {
    //             throw new Error("ไม่สามารถดึงค่าจ้างได้");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching wages:", error);
    //         messageApi.open({
    //             type: "error",
    //             content: "เกิดข้อผิดพลาดในการดึงค่าจ้าง",
    //         });
    //     }
    // };

    const getUserById = async (userId: number) => {
        try {
            let res = await GetUserById(userId);
            if (res.status === 200) {
                setUsers((prevUsers) => ({
                    ...prevUsers,
                    [userId]: res.data,
                }));
            }
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            messageApi.open({
                type: "error",
                content: `เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้ ${userId}`,
            });
        }
    };

    const getBookings = async () => {
        if (workID) {
            setLoading(true);
            try {
                let res = await GetBookingsByWorkID(workID);
                if (res.status === 200) {
                    const bookingsData = res.data;
                    setBookings(bookingsData);

                    const userIds = Array.from(new Set(bookingsData.map((booking) => booking.booker_user_id)));
                    for (const userId of userIds) {
                        await getUserById(userId);
                    }
                } else {
                    setBookings([]);
                    messageApi.open({
                        type: "error",
                        content: res.data.error || "เกิดข้อผิดพลาดในการดึงข้อมูล",
                    });
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
                messageApi.open({
                    type: "error",
                    content: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStatusChange = (bookingId: number, newStatus: string) => {
        setStatusUpdates((prev) => ({
            ...prev,
            [bookingId]: newStatus,
        }));
    };

    const handleSubmitStatusUpdate = async (bookingId: number) => {
        if (!bookingId || !statusUpdates[bookingId]) {
            messageApi.open({
                type: "error",
                content: "Booking ID หรือสถานะไม่ถูกต้อง",
            });
            return;
        }

        try {
            const res = await UpdateBookingStatus(bookingId, statusUpdates[bookingId]);
            if (res.status === 200) {
                messageApi.open({
                    type: "success",
                    content: "อัปเดตสถานะสำเร็จ",
                });
                getBookings(); // Refresh the bookings after update
            } else {
                messageApi.open({
                    type: "error",
                    content: res.data.error || "เกิดข้อผิดพลาดในการอัปเดตสถานะ",
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการอัปเดตสถานะ",
            });
        }
    };

    const handleViewProfile = (userId: number) => {
        navigate(`/resume/view/${userId}`); // นำทางไปที่หน้าโปรไฟล์ของผู้ใช้
    };

    useEffect(() => {
        getBookings();
    }, [workID]);

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
            <h2>จัดการการจองสำหรับงาน ID: {workID}</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    rowKey="ID"
                    columns={columns}
                    dataSource={bookings}
                />
            )}
        </>
    );
}

export default ManageBooking;
