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
    Cascader,
    Tabs
} from "antd";
import { useNavigate } from "react-router-dom";

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

function StudyEdit() {
    const navigate = useNavigate();
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

    const onFinish = (values: any) => {
        // Directly navigate to the next page without showing a message
        navigate("/resume/Edit/experience"); // เปลี่ยนเส้นทางไปยัง /resume/create/experience
    };

    const handleProvinceChange = (value: any) => {
        // value[0] is the selected province value
        setSelectedProvince(provinces.find(p => p.value === value[0])?.label || null);
    };

    const handleTabChange = (key: string) => {
        // Navigate based on the selected tab
        switch (key) {
            case "1":
                navigate("/resume/Edit");
                break;
            case "2":
                navigate("/resume/Edit/study");
                break;
            case "3":
                navigate("/resume/Edit/experience");
                break;
            case "4":
                navigate("/resume/Edit/skill");
                break;
            default:
                break;
        }
    };

    return (
        <div>
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

                <Divider />

                <Tabs defaultActiveKey="2" centered onChange={handleTabChange}>
                    <TabPane tab="ประวัติส่วนตัว" key="1">
                        {/* Content for ประวัติส่วนตัว */}
                        <p>Content for ประวัติส่วนตัว</p>
                    </TabPane>
                    <TabPane tab="การศึกษา" key="2">
                        <Form name="education" layout="vertical" onFinish={onFinish} autoComplete="off">
                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        label="โรงเรียน"
                                        name="school"
                                    >
                                        <Input placeholder="กรุณากรอกชื่อโรงเรียน (ถ้าไม่กรอกก็ไม่เป็นไร)" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        label="ปริญญา"
                                        name="degree"
                                    >
                                        <Input placeholder="กรุณากรอกปริญญา (ถ้าไม่กรอกก็ไม่เป็นไร)" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        label="วันจบการศึกษา"
                                        name="graduation_date"
                                    >
                                        <Input placeholder="กรุณากรอกวันจบการศึกษา (ถ้าไม่กรอกก็ไม่เป็นไร)" type="date" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        label="จังหวัด"
                                        name="education_province"
                                    >
                                        <Cascader
                                            options={provinces}
                                            placeholder="กรุณาเลือกจังหวัด (ถ้าไม่กรอกก็ไม่เป็นไร)"
                                            onChange={handleProvinceChange}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                    {selectedProvince && (
                                        <p style={{ marginTop: '10px' }}>
                                            <strong>จังหวัดที่เลือก:</strong> {selectedProvince}
                                        </p>
                                    )}
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        label="คำอธิบาย"
                                        name="description"
                                    >
                                        <Input.TextArea rows={4} placeholder="เขียนประสบการณ์การศึกษาของคุณ (ถ้าไม่กรอกก็ไม่เป็นไร)" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row justify="end">
                                <Col style={{ marginTop: "40px" }}>
                                    <Form.Item>
                                        <Space>
                                            <Button
                                                htmlType="button"
                                                onClick={() => navigate("/resume/Edit")} // ใช้ navigate เพื่อย้อนกลับ
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
                    </TabPane>
                    <TabPane tab="ประสบการณ์ทำงาน" key="3">
                        {/* Content for ประสบการณ์ทำงาน */}
                        <p>Content for ประสบการณ์ทำงาน</p>
                    </TabPane>
                    <TabPane tab="สกิล" key="4">
                        {/* Content for สกิล */}
                        <p>Content for สกิล</p>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}

export default StudyEdit;
