import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, Avatar, Typography, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetUserProfile, DeleteWorkById, GetPostwork } from "../../../services/https/index";
import { PostworkInterface } from "../../../interfaces/Postwork";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Text } = Typography;

function Work() {
    const navigate = useNavigate();
    const [work, setWorks] = useState<PostworkInterface[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const myId = localStorage.getItem("id");

    const columns: ColumnsType<PostworkInterface> = [
        {
            title: "",
            render: (record) =>
                myId === record?.ID ? null : (
                    <Button
                        type="dashed"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteWorkById(record.ID)}
                    />
                ),
        },
        {
            title: "ลำดับ",
            dataIndex: "ID",
            key: "ID",
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
            title: "ชื่อผู้ใช้",
            key: "user_first_name",
            render: (record) => <>{record?.User?.first_name}</>,
        },
        {
            title: "นามสกุลผู้ใช้",
            key: "user_last_name",
            render: (record) => <>{record?.User?.last_name}</>,
        },
        {
            title: "ชื่องาน",
            key: "work_info",
            render: (record) => <>{record?.Work?.info}</>,
        },
        {
            title: "หมวดหมู่งาน",
            key: "work_category",
            render: (record) => <>{record?.Work?.category}</>,
        },
        {
            title: "ค่าจ้าง",
            key: "work_wages",
            render: (record) => <>{record?.Work?.wages}</>,
        },
        {
            title: "",
            render: (record) => (
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/work/edit/${record.ID}`)}
                >
                    แก้ไขข้อมูล
                </Button>
            ),
        },
    ];

    const deleteWorkById = async (id: string) => {
        let res = await DeleteWorkById(id);

        if (res.status === 200) {
            messageApi.open({
                type: "success",
                content: "ลบข้อมูลสำเร็จ",
            });
            await getPostworks();
        } else {
            messageApi.open({
                type: "error",
                content: res.data.error,
            });
        }
    };

    const getPostworks = async () => {
        let res = await GetPostwork();
        if (res.status === 200) {
            setWorks(res.data);
        } else {
            setWorks([]);
            messageApi.open({
                type: "error",
                content: res.data.error,
            });
        }
    };

    const getUserProfile = async () => {
        try {
            const res = await GetUserProfile();
            setProfile(res);
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Failed to fetch user profile.",
            });
        }
    };

    useEffect(() => {
        getPostworks();
        getUserProfile();
    }, []);

    // กรองข้อมูล postworks ให้แสดงเฉพาะที่ id_user ตรงกับ profile.ID
    const filteredPostworks = work.filter((postwork) => postwork.id_user === profile?.ID);

    return (
        <>
            {contextHolder}
            <Row justify="center" style={{ marginBottom: "20px" }}>
                {profile && (
                    <Col>
                        <Space direction="vertical" align="center">
                            <Avatar src={profile?.Profile} size={128} shape="square" />
                            <Text strong>{profile?.ID} {profile?.FirstName} {profile?.LastName}</Text>
                        </Space>
                    </Col>
                )}
            </Row>
            <Divider />
            <Row>
                <Col span={12}>
                    <h2>จัดการข้อมูลงาน</h2>
                </Col>
                <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
                    <Space>
                        <Link to="/work/create">
                            <Button type="primary" icon={<PlusOutlined />}>
                                สร้างข้อมูล
                            </Button>
                        </Link>
                    </Space>
                </Col>
            </Row>
            <Divider />
            <Table columns={columns} dataSource={filteredPostworks} />
        </>
    );
}

export default Work;
