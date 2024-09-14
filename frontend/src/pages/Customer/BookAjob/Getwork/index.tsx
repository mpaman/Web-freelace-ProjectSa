import { useState, useEffect } from "react";
import { Table, message, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import { GetBookingsByWorkID, GetUserById } from "../../../../services/https/index";
import { BookingInterface } from "../../../../interfaces/Booking";
import { UsersInterface } from "../../../../interfaces/IUser"; // Interface ของผู้ใช้

function Managebooking() {
    const { workID } = useParams<{ workID: string }>();
    const [bookings, setBookings] = useState<BookingInterface[]>([]);
    const [users, setUsers] = useState<Record<number, UsersInterface>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ColumnsType<BookingInterface> = [
        {
            title: "ID ผู้ใช้",
            dataIndex: "booker_user_id",
            key: "booker_user_id",
        },
        {
            title: "ชื่อผู้ใช้",
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
    ];

    const getUserById = async (userId: number) => {
        try {
            let res = await GetUserById(userId);
            if (res.status === 200) {
                setUsers(prevUsers => ({
                    ...prevUsers,
                    [userId]: res.data
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

                    // ดึงข้อมูลผู้ใช้ทั้งหมดที่เกี่ยวข้อง
                    const userIds = Array.from(new Set(bookingsData.map(booking => booking.booker_user_id)));
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

    useEffect(() => {
        getBookings();
    }, [workID]);

    return (
        <>
            {contextHolder}
            <h2>จัดการการจองสำหรับงาน ID: {workID}</h2>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={bookings}
                    style={{ width: "100%", overflow: "scroll" }}
                />
            )}
        </>
    );
}

export default Managebooking;
