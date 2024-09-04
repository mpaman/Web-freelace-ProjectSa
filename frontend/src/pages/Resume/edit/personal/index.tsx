import React, { useState } from 'react';
import {
    Space,
    Button,
    Col,
    Row,
    Divider,
    Form,
    Input,
    Card,
    message,
    Avatar,
    Cascader,
    Upload,
    Tabs
} from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../../interfaces/IUser";
import { CreateUser } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";

const { TabPane } = Tabs;

const provinces = [
    { value: 'bangkok', label: 'กรุงเทพมหานคร' },
    { value: 'chiang_mai', label: 'เชียงใหม่' },
    { value: 'phuket', label: 'ภูเก็ต' },
    { value: 'chiang_rai', label: 'เชียงราย' },
    { value: 'krabi', label: 'กระบี่' },
    { value: 'lampang', label: 'ลำปาง' },
    { value: 'lamphun', label: 'ลำพูน' },
    { value: 'mae_hong_son', label: 'แม่ฮ่องสอน' },
    { value: 'nakhon_nayok', label: 'นครนายก' },
    { value: 'nakhon_pathom', label: 'นครปฐม' },
    { value: 'nakhon_ratchasima', label: 'นครราชสีมา' },
    { value: 'nakhon_sawan', label: 'นครสวรรค์' },
    { value: 'nakhon_si_thammarat', label: 'นครศรีธรรมราช' },
    { value: 'nan', label: 'น่าน' },
    { value: 'narathiwat', label: 'นราธิวาส' },
    { value: 'nong_bua_lam_phu', label: 'หนองบัวลำภู' },
    { value: 'nong_khai', label: 'หนองคาย' },
    { value: 'pathum_thani', label: 'ปทุมธานี' },
    { value: 'phang_nga', label: 'พังงา' },
    { value: 'phatthalung', label: 'พัทลุง' },
    { value: 'phayao', label: 'พะเยา' },
    { value: 'phetchabun', label: 'เพชรบูรณ์' },
    { value: 'phetchaburi', label: 'เพชรบุรี' },
    { value: 'prachin_buri', label: 'ปราจีนบุรี' },
    { value: 'prachuap_khiri_khan', label: 'ประจวบคีรีขันธ์' },
    { value: 'ranong', label: 'ระนอง' },
    { value: 'ratchaburi', label: 'ราชบุรี' },
    { value: 'rayong', label: 'ระยอง' },
    { value: 'sa_kaeo', label: 'สระแก้ว' },
    { value: 'sakon_nakhon', label: 'สกลนคร' },
    { value: 'samut_prakan', label: 'สมุทรปราการ' },
    { value: 'samut_sakhon', label: 'สมุทรสาคร' },
    { value: 'samut_songkhram', label: 'สมุทรสงคราม' },
    { value: 'saraburi', label: 'สระบุรี' },
    { value: 'satun', label: 'สตูล' },
    { value: 'singburi', label: 'สิงห์บุรี' },
    { value: 'sukhothai', label: 'สุโขทัย' },
    { value: 'suphan_buri', label: 'สุพรรณบุรี' },
    { value: 'surat_thani', label: 'สุราษฎร์ธานี' },
    { value: 'surin', label: 'สุรินทร์' },
    { value: 'tak', label: 'ตาก' },
    { value: 'trang', label: 'ตรัง' },
    { value: 'trat', label: 'ตราด' },
    { value: 'ubon_ratchathani', label: 'อุบลราชธานี' },
    { value: 'udon_thani', label: 'อุดรธานี' },
    { value: 'yala', label: 'ยะลา' },
    { value: 'yasothon', label: 'ยโสธร' },
    { value: 'ang_thong', label: 'อ่างทอง' },
    { value: 'amnat_charoen', label: 'อำนาจเจริญ' },
    { value: 'buri_ram', label: 'บุรีรัมย์' },
    { value: 'chanthaburi', label: 'จันทบุรี' },
    { value: 'chachoengsao', label: 'ฉะเชิงเทรา' },
    { value: 'chonburi', label: 'ชลบุรี' },
    { value: 'chumphon', label: 'ชุมพร' },
    { value: 'kaen_kaen', label: 'ขอนแก่น' },
    { value: 'kanchanaburi', label: 'กาญจนบุรี' },
    { value: 'mahasarakham', label: 'มหาสารคาม' },
    { value: 'nakhon_phanom', label: 'นครพนม' }
];

function PersonalEdit() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState<string | undefined>(undefined); // State to store avatar URL

    const handleUploadChange = (info: any) => {
        if (info.file.status === 'done') {
            // Assuming the response contains the URL of the uploaded image
            setAvatar(info.file.response.url);
        }
    };

    const onFinish = async (values: UsersInterface) => {
        try {
            const res = await CreateUser(values);

            if (res.status === 201) {
                messageApi.open({
                    type: "success",
                    content: res.data.message,
                });
                setTimeout(() => {
                    navigate("/"); // Change this path to navigate as needed
                }, 2000);
            } else {
                messageApi.open({
                    type: "error",
                    content: res.data.error,
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการสร้างข้อมูล!",
            });
        }
    };

    const handleNext = async () => {
        try {
            const { postal_code, phone_number } = await form.getFieldsValue([
                "postal_code",
                "phone_number"
            ]);

            if (
                (postal_code && !/^[0-9]{5}$/.test(postal_code)) ||
                (phone_number && !/^[0-9]{10}$/.test(phone_number))
            ) {
                throw new Error("กรุณากรอกข้อมูลให้ถูกต้องหรือเว้นไว้");
            }

            navigate("/resume/Edit/study");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "กรุณากรอกข้อมูลให้ถูกต้องหรือเว้นไว้";
            messageApi.error(errorMessage);
        }
    };

    const handleTabChange = (key: string) => {
        switch (key) {
            case '2':
                navigate('/resume/Edit/study');
                break;
            case '3':
                navigate('/resume/Edit/experience');
                break;
            case '4':
                navigate('/resume/Edit/skill');
                break;
            default:
                break;
        }
    };

    return (
        <div>
            {contextHolder}
            <Card>
                <center>
                    <h2
                        style={{
                            fontSize: "35px",
                            border: "2px solid #1890ff", // Blue border
                            padding: "10px",
                            borderRadius: "5px",
                            display: "inline-block",
                            background: "#06579b", // Light blue background
                            color: "#ffffff", // Darker blue text
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
                            fontWeight: 'bold',
                            fontFamily: 'Arial, sans-serif',
                        }}
                    >
                        Edit Resume
                    </h2>
                </center>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Upload
                        showUploadList={false}
                        action="/upload" // Replace with your upload URL
                        beforeUpload={() => false} // Prevent automatic upload
                        onChange={handleUploadChange}
                    >
                        <Avatar
                            size={128}
                            icon={<UserOutlined />}
                            src={avatar}
                            style={{ cursor: 'pointer' }}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </div>
                    </Upload>
                </div>

                <Divider />
                <div style={{ textAlign: 'center' }}>
                    <Tabs defaultActiveKey="1" centered onChange={handleTabChange}>
                        <TabPane tab="ประวัติส่วนตัว" key="1">
                            <Form form={form} name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
                                <Row gutter={[16, 0]}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                        <Form.Item
                                            label="ชื่อจริง"
                                            name="first_name"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                        <Form.Item
                                            label="นามสกุล"
                                            name="last_name"
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24}>
                                        <Form.Item
                                            label="ที่อยู่"
                                            name="address"
                                        >
                                            <Input.TextArea rows={2} placeholder="กรุณากรอกที่อยู่" />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Item
                                            label="จังหวัด"
                                            name="province"
                                        >
                                            <Cascader options={provinces} placeholder="กรุณาเลือกจังหวัด" />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Item
                                            label="รหัสไปรษณีย์"
                                            name="postal_code"
                                            rules={[
                                                { pattern: /^[0-9]{5}$/, message: "กรุณากรอกรหัสไปรษณีย์ที่ถูกต้อง (5 หลัก)!" }
                                            ]}
                                        >
                                            <Input
                                                maxLength={5}
                                                placeholder="กรุณากรอกรหัสไปรษณีย์"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Item
                                            label="เบอร์โทรศัพท์"
                                            name="phone_number"
                                            rules={[
                                                { pattern: /^[0-9]{10}$/, message: "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (10 หลัก)!" }
                                            ]}
                                        >
                                            <Input
                                                maxLength={10}
                                                placeholder="กรุณากรอกเบอร์โทรศัพท์"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                        <Form.Item
                                            label="อีเมล"
                                            name="email"
                                        >
                                            <Input placeholder="กรุณากรอกอีเมล" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="end">
                                    <Col style={{ marginTop: "40px" }}>
                                        <Form.Item>
                                            <Space>
                                                <Link to="/resume">
                                                    <Button
                                                        htmlType="button"
                                                        style={{
                                                            marginRight: "10px",
                                                            backgroundColor: "red",
                                                            borderColor: "red",
                                                            color: "white",
                                                        }}
                                                    >
                                                        ยกเลิก
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="primary"
                                                    htmlType="button"
                                                    onClick={handleNext}
                                                >
                                                    ไปหน้าถัดไป
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </TabPane>

                        <TabPane tab="การศึกษา" key="2">
                            {/* Add content for the "การศึกษา" tab */}
                            <p>Content for การศึกษา</p>
                        </TabPane>
                        <TabPane tab="ประสบการณ์ทำงาน" key="3">
                            {/* Add content for the "ประสบการณ์ทำงาน" tab */}
                            <p>Content for ประสบการณ์ทำงาน</p>
                        </TabPane>
                        <TabPane tab="สกิล" key="4">
                            {/* Add content for the "สกิล" tab */}
                            <p>Content for สกิล</p>
                        </TabPane>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}

export default PersonalEdit;
