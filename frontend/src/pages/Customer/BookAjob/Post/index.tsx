import { useState, useEffect } from "react";
import { Space, Table, Col, Row, Divider, message, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { GetPostwork, GetUserProfile } from "../../../../services/https/index";
import { PostworkInterface } from "../../../../interfaces/Postwork";

function Postwork() {
    const [postworks, setPostworks] = useState<PostworkInterface[]>([]);
    const [userId, setUserId] = useState<number | null>(null); // เก็บ userId ของผู้ใช้ที่ล็อกอิน
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ColumnsType<PostworkInterface> = [
        {
            title: "ลำดับ",
            dataIndex: "ID",
            key: "id",
        },
        {
            title: "ID ผู้ใช้",
            dataIndex: "id_user",
            key: "id_user",
        },
        {
            title: "ID งาน",
            dataIndex: "id_work",
            key: "id_work",
        },
        {
            title: "ชื่อผู้โพส",
            key: "user_first_name",
            render: (record) => <>{record?.User?.first_name}</>,
        },
        {
            title: "นามสกุลโพส",
            key: "user_last_name",
            render: (record) => <>{record?.User?.last_name}</>,
        },
        {
            title: "รายระเอียดงาน",
            key: "work_info",
            render: (record) => <>{record?.Work?.info}</>,
        },
        {
            title: "หมวดหมู่งาน",
            key: "work_category",
            render: (record) => <>{record?.Work?.category}</>,
        },
        {
            title: "ค่าจ้าง (บาท)",
            key: "work_wages",
            render: (record) => <>{record?.Work?.wages}  </>,
        },
        {
            title: "จัดการการจอง",
            key: "actions",
            render: (record) => (
                <Space>
                    <Link to={`/works/${record.id_work}/bookings`}>
                        <Button type="primary">จัดการการจอง</Button>
                    </Link>
                    {/* ช่องติดตามงานใหม่ */}
                    <Link to={`/works/${record.id_work}/track`}>
                        <Button type="default">ติดตามงาน</Button>
                    </Link>
                </Space>
            ),
        },
    ];

    // ฟังก์ชันดึงโปรไฟล์ผู้ใช้
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

    // ฟังก์ชันดึงข้อมูล postworks
    const getPostworks = async () => {
        let res = await GetPostwork();
        if (res.status === 200) {
            const allPostworks = res.data;
            if (userId) {
                // กรองเฉพาะ postworks ของผู้ใช้ที่ล็อกอิน
                const userPostworks = allPostworks.filter(
                    (postwork: PostworkInterface) => postwork.id_user === userId
                );
                setPostworks(userPostworks);
            } else {
                setPostworks([]);
            }
        } else {
            setPostworks([]);
            messageApi.open({
                type: "error",
                content: res.data.error,
            });
        }
    };

    useEffect(() => {
        // เรียก fetchUserProfile เพื่อดึง userId ก่อน แล้วจึงเรียก getPostworks
        fetchUserProfile().then(() => {
            getPostworks();
        });
    }, [userId]); // ดัก userId เพื่อดึงข้อมูลเมื่อ userId เปลี่ยน

    return (
        <>
            {contextHolder}
            <Row>
                <Col span={12}>
                    <h2>รายการ Postwork ของคุณ</h2>
                </Col>
            </Row>
            <Divider />
            <div style={{ marginTop: 20 }}>
                <Table
                    rowKey="ID"
                    columns={columns}
                    dataSource={postworks}
                    style={{ width: "100%", overflow: "scroll" }}
                />
            </div>
        </>
    );
}

export default Postwork;
