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
    Button as AntButton,
    Slider,
    Tabs
} from "antd";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

function SkillEdit() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedLevels, setSelectedLevels] = useState<{ [key: string]: number }>({});

    const onFinish = async (values: any) => {
        console.log(values);

        // Show success message
        messageApi.open({
            type: "success",
            content: "ข้อมูลทักษะได้รับการบันทึกแล้ว!",
        });

        // Optionally navigate to a different page after showing the message
        setTimeout(() => {
            navigate("/resume"); // Change this path to navigate back to /resume
        }, 2000);
    };

    const handleLevelChange = (name: any, level: number) => {
        setSelectedLevels(prev => ({
            ...prev,
            [name]: level
        }));
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
                <Divider />

                <Tabs defaultActiveKey="4" centered onChange={handleTabChange}>
                    <TabPane tab="ประวัติส่วนตัว" key="1">
                        {/* Content can be added here if needed */}
                    </TabPane>
                    <TabPane tab="การศึกษา" key="2">
                        {/* Content can be added here if needed */}
                    </TabPane>
                    <TabPane tab="ประสบการณ์ทำงาน" key="3">
                        {/* Content can be added here if needed */}
                    </TabPane>
                    <TabPane tab="สกิล" key="4">
                        {/* Content can be added here if needed */}
                    </TabPane>
                </Tabs>

                <Form name="skills" layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Form.List
                        name="skills_list"
                        initialValue={[{ skill: '', level: 50 }]} // Default value for skill level
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row gutter={[16, 0]} key={key} style={{ marginBottom: '16px', justifyContent: 'center' }}>
                                        <Col xs={24} sm={12} md={12} lg={10} xl={9}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'skill']}
                                                label="ทักษะ"
                                                style={{ width: '100%', maxWidth: '400px' }}
                                            >
                                                <Input placeholder="กรุณากรอกทักษะ" />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={12} md={12} lg={14} xl={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'level']}
                                                label="ระดับ"
                                                style={{ width: '100%', maxWidth: '400px' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Slider
                                                        min={1}
                                                        max={100}
                                                        value={selectedLevels[name] || 50} // Default value
                                                        onChange={(value) => handleLevelChange(name, value)}
                                                        style={{ flex: 1, width: '80%' }}
                                                    />
                                                    <span style={{ marginLeft: '8px' }}>{selectedLevels[name] || 50}%</span>
                                                    <AntButton
                                                        type="link"
                                                        onClick={() => remove(name)}
                                                        style={{ marginLeft: '8px' }}
                                                    >
                                                        ลบ
                                                    </AntButton>
                                                </div>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: '100%' }}
                                    >
                                        เพิ่มทักษะ
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Row justify="end">
                        <Col style={{ marginTop: "40px", textAlign: 'center' }}>
                            <Form.Item>
                                <Space>
                                    <Button
                                        htmlType="button"
                                        onClick={() => navigate("/resume/Edit/experience")} // Navigate to previous page
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
                                        htmlType="submit" // Submit the form
                                    >
                                        เสร็จสิ้น
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
    );
}

export default SkillEdit;
