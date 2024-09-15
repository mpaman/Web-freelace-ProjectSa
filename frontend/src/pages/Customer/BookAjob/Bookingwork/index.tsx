import { useState, useEffect } from "react";
import { Table, message, Spin } from "antd";
import { Link } from "react-router-dom"; // Import Link สำหรับการเชื่อมโยง
import type { ColumnsType } from "antd/es/table";
import { GetAllBookings, GetUserById, GetUserProfile, GetWorkById } from "../../../../services/https/index"; // Import ฟังก์ชันที่สร้าง
import { BookingInterface } from "../../../../interfaces/Booking";
import { UsersInterface } from "../../../../interfaces/IUser"; // Interface ของผู้ใช้
import { WorkInterface } from "../../../../interfaces/Work"; // Interface ของงาน

function Bookingwork() {
    const [bookings, setBookings] = useState<BookingInterface[]>([]);
    const [users, setUsers] = useState<Record<number, UsersInterface>>({});
    const [works, setWorks] = useState<Record<number, WorkInterface>>({}); // เก็บข้อมูลงานที่เกี่ยวข้อง
    const [loading, setLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [userId, setUserId] = useState<number | null>(null); // เก็บ userId ของผู้ใช้ที่ล็อกอิน

    const columns: ColumnsType<BookingInterface> = [
        {
            title: "ID work",
            dataIndex: "work_id",
            key: "work_id",
        },
        {
            title: "รายระเอียดงาน",
            key: "info",
            render: (record) => works[record.work_id]?.info || 'No info',
        },
        {
            title: "ค่าจ้าง (บาท)",
            key: "wages",
            render: (record) => works[record.work_id] ?.wages|| 'No wages information'  ,
        },
        {
            title: "ข้อมูลการติดต่อ",
            key: "contact",
            render: (record) => works[record.work_id]?.contact || 'No contact information',
        },
        {
            title: "สถานะงาน",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "หน้าของโพสต์",
            key: "post_page",
            render: (record) => (
                <Link to={`/post/${record.work_id}`}>ดูรายละเอียดโพสต์</Link>
            ),
        },
    ];

    // ดึงโปรไฟล์ผู้ใช้ที่ล็อกอิน
    const fetchUserProfile = async () => {
        try {
            const profileRes = await GetUserProfile();
            setUserId(profileRes.ID); // เก็บ userId ของผู้ใช้ที่ล็อกอิน
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์ผู้ใช้",
            });
        }
    };

    // ดึงข้อมูลผู้ใช้
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
            messageApi.open({
                type: "error",
                content: `เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้ ${userId}`,
            });
        }
    };

    // ดึงข้อมูลงานที่เกี่ยวข้อง
    const getWorkById = async (workId: number) => {
        try {
            let res = await GetWorkById(workId);
            if (res.status === 200) {
                setWorks((prevWorks) => ({
                    ...prevWorks,
                    [workId]: res.data,
                }));
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: `เกิดข้อผิดพลาดในการดึงข้อมูลงาน ${workId}`,
            });
        }
    };

    // ดึงข้อมูลการจองทั้งหมด
    const getAllBookings = async () => {
        setLoading(true);
        try {
            let res = await GetAllBookings();
            if (res.status === 200) {
                const allBookings = res.data;
                if (userId) {
                    // กรองเฉพาะการจองที่ผู้ใช้เป็นคนจอง
                    const userBookings = allBookings.filter(
                        (booking: BookingInterface) => booking.booker_user_id === userId
                    );
                    setBookings(userBookings);

                    // ดึงข้อมูลงานที่เกี่ยวข้อง
                    const workIds = Array.from(new Set(userBookings.map((booking) => booking.work_id)));
                    for (const workId of workIds) {
                        await getWorkById(workId);
                    }
                }

                // ดึงข้อมูลผู้ใช้ที่เกี่ยวข้อง
                const userIds = Array.from(new Set(allBookings.map((booking) => booking.booker_user_id)));
                for (const userId of userIds) {
                    await getUserById(userId);
                }
            } else {
                setBookings([]);
                messageApi.open({
                    type: "error",
                    content: "เกิดข้อผิดพลาดในการดึงข้อมูลการจอง",
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // เรียก fetchUserProfile เพื่อดึงข้อมูล userId ก่อน แล้วจึงเรียก getAllBookings
        fetchUserProfile().then(() => {
            getAllBookings();
        });
    }, [userId]); // ดัก userId เพื่อดึงข้อมูลเมื่อ userId เปลี่ยน

    return (
        <>
            {contextHolder}
            <h2>ข้อมูลการจองของคุณ</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    rowKey="ID"
                    columns={columns}
                    dataSource={bookings}
                    style={{ width: "100%", overflow: "scroll" }}
                />
            )}
        </>
    );
}

export default Bookingwork;
