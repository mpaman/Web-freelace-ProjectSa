import { useState, useEffect } from "react";
import { Card, Col, Row, message, Button, Tooltip } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { GetUsers } from "../../../services/https/index";
import { UsersInterface } from "../../../interfaces/IUser";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const thaiProvinces = [
    { id: 1, name: "กรุงเทพมหานคร" },
    { id: 2, name: "นครราชสีมา" },
    // Add all provinces here...
];

function UserProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UsersInterface | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [provinces, setProvinces] = useState<{ id: number; name: string }[]>([]);
    const myId = localStorage.getItem("id");

    const getUser = async () => {
        let res = await GetUsers();

        if (res.status === 200) {
            console.log(res.data); // ตรวจสอบข้อมูลที่ได้รับ
            const currentUser = res.data.find(
                (user: UsersInterface) => user.ID.toString() === myId
            );
            setUser(currentUser || null);
        } else {
            setUser(null);
            messageApi.open({
                type: "error",
                content: res.data.error,
            });
        }
    };


    useEffect(() => {
        setProvinces(thaiProvinces); // Set provinces on component mount
        getUser();
    }, []);

    const getProvinceName = (provinceId: number) => {
        const province = provinces.find((p) => p.id === provinceId);
        return province ? province.name : "ไม่ระบุ";
    };

    return (
        <>
            {contextHolder}
            <div
                style={{
                    padding: "40px",
                    backgroundColor: "#f5f5f5", // Solid color background
                }}
            >
                <Row gutter={24} style={{ marginTop: 20 }}>
                    <Col span={24} style={{ marginBottom: '20px' }}>
                        <h1 style={{ textAlign: "center", fontWeight: 600, color: "#333" }}>PROFILE</h1>
                    </Col>
                    <Col span={8}>
                        <Card
                            bordered={false}
                            style={{
                                position: "relative",
                                borderRadius: "12px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div style={{ textAlign: "center", position: "relative" }}>
                                {user?.Profile ? (
                                    <img
                                        src={user.Profile}
                                        alt="Profile"
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            borderRadius: "50%",
                                            marginBottom: "20px",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            borderRadius: "50%",
                                            backgroundColor: "#f0f0f0",
                                            marginBottom: "20px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        ไม่มีรูป
                                    </div>
                                )}
                                <Tooltip title="แก้ไข">
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => navigate(`/customer/edit/${user?.ID}`)}
                                        style={{
                                            position: "absolute",
                                            top: 10,
                                            right: 10,
                                            borderRadius: "50%",
                                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                                        }}
                                    />
                                </Tooltip>
                                <h2 style={{ fontWeight: 600, marginTop: 10 }}>
                                    {user?.first_name} {user?.last_name}
                                </h2>
                                <p style={{ color: "#888" }}>{user?.email}</p>
                            </div>

                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                <Button
                                    type="primary"
                                    icon={<EyeOutlined />}
                                    onClick={() => navigate(`/customer/profile/${user?.ID}`)}
                                    style={{ marginRight: 8, backgroundColor: '#06579b', borderColor: '#06579b', borderRadius: '5px' }}
                                >
                                    ดูตัวอย่างโปรไฟล์
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card
                            title="ข้อมูลส่วนตัว"
                            bordered={false}
                            style={{
                                marginBottom: 20,
                                borderRadius: "12px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <p>
                                <strong>ชื่อ:</strong> {user?.first_name}
                            </p>
                            <p>
                                <strong>นามสกุล:</strong> {user?.last_name}
                            </p>
                            <p>
                                <strong>วัน/เดือน/ปี เกิด:</strong>{" "}
                                {dayjs(user?.birthday).format("DD/MM/YYYY")}
                            </p>
                            <p>
                                <strong>อายุ:</strong> {user?.age}
                            </p>
                            {/* <p>
                                <strong>เพศ:</strong> {user?.gender?.gender}
                            </p> */}
                            <p>
                                <strong>บริษัท:</strong> {user?.company}
                            </p>
                        </Card>

                        <Card
                            title="ที่อยู่"
                            bordered={false}
                            style={{
                                marginBottom: 20,
                                borderRadius: "12px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <p>ต.{user?.subdistrict} อ.{user?.district} จ.{user?.province} {user?.postalcode}</p>
                        </Card>
                        <Card
                            title="ข้อมูลติดต่อ"
                            bordered={false}
                            style={{ borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", marginBottom: '20px' }} // Add marginBottom here
                        >
                            <p>
                                <strong>Contact:</strong> {user?.Contact}
                            </p>
                        </Card>

                        <Card
                            title="ประสบการณ์จ้างงาน"
                            bordered={false}
                            style={{ borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} // No marginBottom needed here
                        >
                            <p>
                                <strong>Experience:</strong> {user?.experience} ปี
                            </p>
                        </Card>

                    </Col>
                </Row>
            </div>
        </>
    );
}

export default UserProfile;