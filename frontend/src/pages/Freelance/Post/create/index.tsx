import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Input, Typography, Space, Button, Form, message, Avatar, InputNumber } from "antd";
import { GetWorkById, UpdateWorkById, CreateWork, GetUserProfile } from "../../../../services/https/index";
import videoBg from "../../../../assets/back.mp4";
const { Text } = Typography;

export default function PostEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [profileImage, setProfileImage] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    useEffect(() => {
        fetchUserProfile();
        if (id) {
            getWorkById(id);
        }
    }, [id]);

    const fetchUserProfile = async () => {
        try {
            const profileRes = await GetUserProfile();
            setProfileImage(profileRes.Profile || "");
            setFirstName(profileRes.FirstName || "No first name");
            setLastName(profileRes.LastName || "No last name");
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Failed to fetch user profile",
            });
        }
    };

    const getWorkById = async (id: string) => {
        try {
            let res = await GetWorkById(id);
            if (res.status === 200) {
                form.setFieldsValue({
                    Info: res.data.Info,
                    Wages: res.data.Wages,
                    Category: res.data.Category,
                    Contact: res.data.Contact,
                });
            } else {
                messageApi.open({
                    type: "error",
                    content: "ไม่พบข้อมูลงาน",
                });
                setTimeout(() => {
                    navigate("/work");
                }, 2000);
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Error fetching work data",
            });
        }
    };

    const generateRandomWorkID = () => {
        const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
        const digits = Math.floor(100 + Math.random() * 900);
        return `${letters}${digits}`;
    };

    const validateContact = (rule: any, value: string) => {
        const urlPattern = /^https?:\/\//;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^0\d{9}$/;

        if (!value) {
            return Promise.reject(new Error("กรุณากรอกข้อมูลติดต่อ"));
        }

        if (urlPattern.test(value)) return Promise.resolve();
        if (emailPattern.test(value) && value.includes("@gmail.com")) return Promise.resolve();
        if (phonePattern.test(value)) return Promise.resolve();

        return Promise.reject(new Error("กรุณากรอก URL, อีเมล (@gmail.com) หรือเบอร์โทรให้ถูกต้อง"));
    };

    const onFinish = async (values: any) => {
        let payload = { ...values, WorkID: id ? undefined : generateRandomWorkID() };

        let res;
        try {
            res = id ? await UpdateWorkById(id, payload) : await CreateWork(payload);

            if (res.status === 200 || res.status === 201) {
                messageApi.open({
                    type: "success",
                    content: id ? "แก้ไขข้อมูลสำเร็จ" : "สร้างข้อมูลสำเร็จ",
                });
                setTimeout(() => {
                    navigate("/work");
                }, 2000);
            } else {
                messageApi.open({
                    type: "error",
                    content: res.data.error || "Unknown error occurred",
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Error submitting form",
            });
        }
    };

    return (
        <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: 'rgba(240, 242, 245, 0.6)' }}>
            {contextHolder}

            {/* Background video */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, overflow: "hidden" }}>
                <video
                    autoPlay
                    loop
                    muted
                    style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -1, filter: "brightness(0.6)" }}
                >
                    <source src={videoBg} type="video/mp4" />
                </video>
            </div>

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "800px", padding: "20px", background: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <Row justify="center" style={{ marginBottom: "20px" }}>
                </Row>

                <Row justify="center" style={{ marginBottom: "20px" }}>
                    <Col>
                        <h1 style={{ textAlign: "center" }}>{id ? "EDIT WORK" : "CREATE WORK"}</h1>
                    </Col>
                </Row>

                <Row justify="center" style={{ marginBottom: "20px" }}>
                    <Col style={{ textAlign: "center" }}>
                        <Space direction="vertical" size={30}>
                            {profileImage ? (
                                <Avatar shape="square" size={200} src={profileImage} />
                            ) : (
                                <Avatar shape="square" size={200} style={{ backgroundColor: "#ccc" }}>No Image</Avatar>
                            )}
                            <Text>{firstName} {lastName}</Text>
                        </Space>
                    </Col>
                </Row>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="รายละเอียดงาน" name="Info" rules={[{ required: true, message: "กรุณากรอกข้อมูลเพิ่มเติม" }]}>
                        <Input.TextArea
                            placeholder="กรุณากรอกข้อมูล"
                            style={{ width: "100%", height: "200px", borderRadius: "8px", padding: "12px", border: "1px solid #d9d9d9" }}
                        />
                    </Form.Item>

                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <Form.Item label="ค่าจ้าง (บาท)" name="Wages" rules={[{ required: true, message: "กรุณากรอกค่าจ้าง" }]}>
                            <InputNumber min={0} max={10000000} placeholder="กรุณากรอกค่าจ้าง" style={{ width: "100%", height: "40px", borderRadius: "8px" }} />
                        </Form.Item>

                        <Form.Item label="หมวดหมู่" name="Category" rules={[{ required: true, message: "กรุณากรอกหมวดหมู่" }]}>
                            <Input placeholder="กรุณากรอกหมวดหมู่" style={{ width: "100%", height: "40px", borderRadius: "8px" }} />
                        </Form.Item>

                        <Form.Item label="เบอร์โทร / อีเมล / ลิงก์" name="Contact" rules={[{ validator: validateContact }]}>
                            <Input placeholder="กรุณากรอกข้อมูลติดต่อ" style={{ width: "100%", height: "40px", borderRadius: "8px" }} />
                        </Form.Item>
                    </Space>

                    <Form.Item>
                        <div style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit" size="large" style={{ width: "150px", height: "50px", borderRadius: "8px" }}>
                                {id ? "แก้ไขข้อมูล" : "บันทึกข้อมูล"}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
