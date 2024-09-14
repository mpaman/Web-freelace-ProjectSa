import { useState, useEffect } from "react";
import { Table, message, Spin, Select, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import { GetBookingsByWorkID, GetUserById, UpdateBookingStatus } from "../../../../services/https/index";
import { BookingInterface } from "../../../../interfaces/Booking";
import { UsersInterface } from "../../../../interfaces/IUser"; // Interface ของผู้ใช้

const { Option } = Select;

function Managebooking() {
    const { workID } = useParams<{ workID: string }>();
    const [bookings, setBookings] = useState<BookingInterface[]>([]);
    const [users, setUsers] = useState<Record<number, UsersInterface>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [statusUpdates, setStatusUpdates] = useState<Record<number, string>>({}); // Track updated status

    const columns: ColumnsType<BookingInterface> = [
        {
            title: "Booking ID",
            dataIndex: "ID",
            key: "ID",
        },
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

    const handleStatusChange = (bookingId: number, newStatus: string) => {
        setStatusUpdates(prev => ({
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
    
        console.log(`Updating booking ID ${bookingId} to status ${statusUpdates[bookingId]}`); // Debugging line
    
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
                    rowKey="ID"
                    columns={columns}
                    dataSource={bookings}
                    style={{ width: "100%", overflow: "scroll" }}
                />
            )}
        </>
    );
}

export default Managebooking;
