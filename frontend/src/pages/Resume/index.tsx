import { useState, useEffect } from "react";
import { Space, Button, Col, Row, Divider, message, Card, Avatar } from "antd";
import { PlusOutlined, EditOutlined, SettingOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Meta } = Card;

function ResumeMain() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [resumeData, setResumeData] = useState<any>(null); // Adjust type based on your data structure

    // Fetch resume data
    const fetchResumeData = () => {
        // Assume resume data is stored in local storage with a key 'resumeData'
        const data = localStorage.getItem('resumeData');
        if (data) {
            setResumeData(JSON.parse(data));
        } else {
            messageApi.open({
                type: "warning",
                content: "No resume data found.",
            });
        }
    };

    useEffect(() => {
        fetchResumeData();
    }, []);

    // Example data to use if no resume data is found
    const exampleResume = {
        firstName: "John Doe",
        position: "Software Engineer",
        experience: "5 years in software development",
        contact: "john.doe@example.com",
    };

    return (
        <>
            {contextHolder}
            <Row>
                <Col span={24} style={{ textAlign: "center", marginBottom: 20 }}>
                    <h1
                        style={{
                            fontSize: "48px",
                            fontWeight: "bold",
                            color: "#0044cc",
                            margin: "20px 0",
                        }}
                    >
                        Resume Management
                    </h1>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={24} style={{ textAlign: "center" }}>
                    <Space>
                        <Link to="/resume/create">
                            <Button type="primary" icon={<PlusOutlined />}>
                                สร้าง Resume
                            </Button>
                        </Link>
                        <Link to="/resume/edit/personal">
                            <Button type="default" icon={<EditOutlined />}>
                                แก้ไข Resume
                            </Button>
                        </Link>
                    </Space>
                </Col>
            </Row>

            <Divider />

            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card
                        style={{ width: 600, backgroundColor: '#f5f5f5' }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => messageApi.open({ type: "info", content: "Settings clicked!" })} />,
                            <EditOutlined key="edit" onClick={() => messageApi.open({ type: "info", content: "Edit clicked!" })} />,
                            <EllipsisOutlined key="ellipsis" onClick={() => messageApi.open({ type: "info", content: "More options clicked!" })} />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                            title={resumeData ? resumeData.firstName : exampleResume.firstName}
                            description={`Position: ${resumeData ? resumeData.position : exampleResume.position}`}
                        />
                        <p><strong>ประสบการณ์:</strong> {resumeData ? resumeData.experience : exampleResume.experience}</p>
                        <p><strong>ติดต่อ:</strong> {resumeData ? resumeData.contact : exampleResume.contact}</p>
                    </Card>
                </Col>
            </Row>

            <Divider />
        </>
    );
}

export default ResumeMain;
