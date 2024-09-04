import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { Row, Col, Input, Typography, Select, Space, Button, Form, message, Avatar } from "antd";

import { GetUsersById, UpdateUsersById } from "../../../../services/https/index";

import dayjs from "dayjs";



const { Text } = Typography;



const handleChange = (value: string) => {

    console.log(`selected ${value}`);

};



const imageUrl = 'https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/286452690_1402478846887916_1887857152927935811_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=e5XDbLZoVP8Q7kNvgF7Oebg&_nc_ht=scontent-bkk1-2.xx&oh=00_AYAWgqDqV6udOhGZlhwuiwCM3S18frQU0EkChS33lEm9Rg&oe=66D39DE2';



export default function PostEdit() {

    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const [form] = Form.useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const [userName, setUserName] = useState<string>("");

    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);



    // Get the logged-in user ID 

    const loggedInUserId = localStorage.getItem("id");



    // Fetch user data by ID 

    const getUserById = async (id: string) => {

        let res = await GetUsersById(id);

        if (res.status === 200) {

            setUserName(res.data.first_name + " " + res.data.last_name);

            form.setFieldsValue({

                address: res.data.address,

                wages: res.data.Wages,

                category: res.data.Category,

                contact: res.data.Contact,

            });

            // Check if the fetched user is the logged-in user 

            setIsCurrentUser(res.data.ID === loggedInUserId);

        } else {

            messageApi.open({

                type: "error",

                content: "ไม่พบข้อมูลผู้ใช้",

            });

            setTimeout(() => {

                navigate("/customer");

            }, 2000);

        }

    };



    useEffect(() => {

        if (id) {

            getUserById(id);

        }

    }, [id]);



    const onFinish = async (values: any) => {

        let payload = {

            ...values,

        };

        const res = await UpdateUsersById(id!, payload);

        if (res.status === 200) {

            messageApi.open({

                type: "success",

                content: res.data.message,

            });

            setTimeout(() => {

                navigate("/customer");

            }, 2000);

        } else {

            messageApi.open({

                type: "error",

                content: res.data.error,

            });

        }

    };



    return (

        <div>

            {contextHolder}

            <Row gutter={[16, 16]}>

                <Col xs={24} sm={24} md={24} lg={24} xl={24}>

                    <h1>EDIT POST</h1>

                </Col>

                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                    <Space direction="vertical" size={30} style={{ textAlign: 'center' }}>

                        <Avatar shape="square" size={200} src={imageUrl} />

                        <Text strong>{userName}</Text> {/* Display user name */}

                        {isCurrentUser && <Text type="secondary">You are currently logged in.</Text>} {/* Display message if it's the logged-in user */}

                    </Space>

                </Col>

                <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>

                    <Form

                        form={form}

                        layout="vertical"

                        onFinish={onFinish}

                    >

                        <Row gutter={[200, 16]} justify="center">

                            <Col span={24} md={12}>

                                <Form.Item

                                    label="รายละเอียดงาน"

                                    name="address"

                                    rules={[{ required: true, message: 'กรุณากรอกข้อความเพิ่มเติมที่นี่' }]}

                                >

                                    <Input.TextArea

                                        placeholder="กรุณากรอกข้อความเพิ่มเติมที่นี่"

                                        style={{ width: '1000px', height: '300px', boxSizing: 'border-box' }}

                                    />

                                </Form.Item>

                            </Col>

                            <Col span={24} md={12}>

                                <Space direction="vertical" style={{ width: '100%' }} size="large">

                                    <Form.Item

                                        label="ค่าจ้าง"

                                        name="wages"

                                        rules={[{ required: true, message: 'กรุณากรอกข้อความที่นี่' }]}

                                    >

                                        <Input

                                            placeholder="กรุณากรอกข้อความที่นี่"

                                            style={{ width: '100%', maxWidth: '300px', height: '40px' }}

                                        />

                                    </Form.Item>

                                    <Form.Item

                                        label="หมวดหมู่"

                                        name="category"

                                        rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่' }]}

                                    >

                                        <Select

                                            style={{ width: '100%', maxWidth: '300px' }}

                                            onChange={handleChange}

                                            options={[

                                                { value: 'jack', label: 'ออกแบบเว็บไซต์' },

                                                { value: 'lucy', label: 'เขียนบทความ' },

                                                { value: 'Yiminghe', label: 'แปลภาษาอังกฤษ-ไทย' },

                                                { value: 'disabled', label: 'การตลาด' },

                                                { value: 'disabled', label: 'นักพัฒนาแอปพลิเคชันมือถือ' },

                                            ]}

                                        />

                                    </Form.Item>

                                    <Form.Item

                                        label="Contact" // Updated label 

                                        name="contact" // Updated name 

                                        rules={[{ required: true, message: 'กรุณากรอกข้อมูลที่นี่' }]}

                                    >

                                        <Input

                                            placeholder="กรุณากรอกข้อมูลที่นี่" // Updated placeholder 

                                            style={{ width: '100%', maxWidth: '300px', height: '40px' }}

                                        />

                                    </Form.Item>

                                </Space>

                            </Col>

                        </Row>

                        <Row justify="center" style={{ marginTop: '40px' }}>

                            <Col>

                                <Button type="primary" htmlType="submit" onClick={() => navigate('/')}>

                                    POST

                                </Button>

                            </Col>

                        </Row>

                    </Form>

                </div>

            </Row>

        </div>

    );

} 