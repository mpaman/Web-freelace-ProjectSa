import React from 'react';
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
    DatePicker,
    Select,
    Tabs
} from "antd";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

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

function ExperienceCreate() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        console.log(values);
        // Navigate directly to the intended page
        navigate("/resume/create/skill"); // เปลี่ยนเส้นทางที่นี่
    };

    const handleTabChange = (key: string) => {
        // Navigate based on the selected tab
        switch (key) {
            case "1":
                navigate("/resume/create");
                break;
            case "2":
                navigate("/resume/create/study");
                break;
            case "3":
                navigate("/resume/create/experience");
                break;
            case "4":
                navigate("/resume/create/skill");
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
                        Create Resume
                    </h2>
                </center>

                <Divider />

                <Tabs defaultActiveKey="3" centered onChange={handleTabChange}>
                    <Tabs.TabPane tab="ประวัติส่วนตัว" key="1">
                        {/* Content for ประวัติส่วนตัว */}
                        <p>Content for ประวัติส่วนตัว</p>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="การศึกษา" key="2">
                        {/* Content for การศึกษา */}
                        <p>Content for การศึกษา</p>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="ประสบการณ์ทำงาน" key="3">
                        <Form name="work_experience" layout="vertical" onFinish={onFinish} autoComplete="off">
                            <Row gutter={[16, 0]}>

                                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        label="บริษัท"
                                        name="employer"
                                    >
                                        <Input placeholder="กรุณากรอกชื่อบริษัท" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        label="ตำแหน่งงาน"
                                        name="position"
                                    >
                                        <Input placeholder="กรุณากรอกตำแหน่งงาน" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                    <Form.Item
                                        label="ช่วงเวลา"
                                        name="dates"
                                    >
                                        <RangePicker
                                            format="YYYY-MM-DD"
                                            placeholder={['วันที่เริ่มงาน', 'วันที่สิ้นสุดงาน']}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        label="จังหวัด"
                                        name="province"
                                    >
                                        <Select
                                            placeholder="กรุณาเลือกจังหวัด"
                                            options={provinces}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        label="คำอธิบาย"
                                        name="description"
                                    >
                                        <Input.TextArea rows={4} placeholder="เขียนคำอธิบายเกี่ยวกับประสบการณ์การทำงานของคุณ" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row justify="end">
                                <Col style={{ marginTop: "40px" }}>
                                    <Form.Item>
                                        <Space>
                                            <Button
                                                htmlType="button"
                                                onClick={() => navigate("/resume/create/study")} // ใช้ navigate เพื่อย้อนกลับ
                                                style={{
                                                    marginRight: "10px",
                                                    backgroundColor: "red",
                                                    borderColor: "red",
                                                    color: "white",
                                                }}
                                            >
                                                ย้อนกลับ
                                            </Button>
                                            <Button
                                                type="primary"
                                                htmlType="submit" // ใช้ htmlType="submit" เพื่อส่งฟอร์ม
                                            >
                                                ไปหน้าถัดไป
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="สกิล" key="4">
                        {/* Content for สกิล */}
                        <p>Content for สกิล</p>
                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </div>
    );
}

export default ExperienceCreate;
