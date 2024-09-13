    import { useState, useEffect } from "react";
    import { Table, message } from "antd";
    import type { ColumnsType } from "antd/es/table";
    import { useParams } from "react-router-dom";
    import { GetBookingsByWorkID } from "../../../../services/https/index";
    import { BookingInterface } from "../../../../interfaces/Booking";

    function Managebooking() {
        const { workID } = useParams<{ workID: string }>();
        const [bookings, setBookings] = useState<BookingInterface[]>([]);
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
                        {record.User ? `${record.User.first_name} ${record.User.last_name}` : "ไม่ระบุ"}
                    </>
                ),
            },
            {
                title: "วันที่จอง",
                dataIndex: "booking_date",
                key: "booking_date",
                render: (text) => <>{text ? new Date(text).toLocaleDateString() : "N/A"}</>,
            },
            {
                title: "ID งาน",
                key: "adjusted_work_id",
                render: (record) => record.work_id ,
            },
        ];

        const getBookings = async () => {
            if (workID) {
                try {
                    let res = await GetBookingsByWorkID(workID);
                    console.log("API Response:", res);
                    if (res.status === 200) {
                        setBookings(res.data);
                    } else {
                        setBookings([]);
                        messageApi.open({
                            type: "error",
                            content: res.data.error || "เกิดข้อผิดพลาดในการดึงข้อมูล",
                        });
                    }
                } catch (error) {
                    console.error("Error fetching bookings:", error); // แสดงข้อผิดพลาด
                    messageApi.open({
                        type: "error",
                        content: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                    });
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
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={bookings}
                    style={{ width: "100%", overflow: "scroll" }}
                />
            </>
        );
    }

    export default Managebooking;
