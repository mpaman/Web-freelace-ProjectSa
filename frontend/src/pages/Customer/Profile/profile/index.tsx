import { useEffect, useState } from "react";
import { Space, Button, Col, Row, Card, Divider, message } from "antd";
import { GetUserById } from "../../../../services/https";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import videoBg from "../../../../assets/back.mp4";
function CustomerView() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [messageApi, contextHolder] = message.useMessage();
    const [userData, setUserData] = useState<any>({});
    const location = useLocation();
    const postworkInfo = location.state?.info || ''; // Get the work info from Postwork page

    const getUserById = async (id: string) => {
        try {
            let res = await GetUserById(id);
            if (res.status === 200) {
                setUserData(res.data);
            } else {
                messageApi.open({
                    type: "error",
                    content: "ไม่พบข้อมูลผู้ใช้",
                });
                setTimeout(() => {
                    navigate("/customer");
                }, 2000);
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "ไม่สามารถดึงข้อมูลผู้ใช้ได้",
            });
        }
    };

    // ฟังก์ชันสำหรับตัดข้อความหลัง 100 ตัวอักษร
    const formatWorkInfo = (text: string) => {
        const maxLength = 100; // จำนวนตัวอักษรที่ต้องการให้แสดงก่อนตัด
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "\n" + text.slice(maxLength); // เพิ่ม "\n" เพื่อให้ลงบรรทัดใหม่
        }
        return text;
    };

    useEffect(() => {
        if (id) {
            getUserById(id);
        }
    }, [id]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'linear-gradient(to right, #ece9e6, #ffffff)',
            padding: '50px 20px',
        }}>
            {contextHolder}
                                    {/* Background video */}
                                    <video
                autoPlay
                loop
                muted
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                    filter: "brightness(0.6)",
                }}
            >
                <source src={videoBg} type="video/mp4" />
            </video>
            <Card
                style={{
                    maxWidth: '1000px',
                    margin: 'auto',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // เพิ่มความโปร่งใสให้การ์ด
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',   // เพิ่มเงาให้การ์ดดูหรู
                    backdropFilter: 'blur(10px)',
                    padding: '40px',
                }}
                bordered={false}
            >
                {/* Profile Header */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        {userData.Profile ? (
                            <img
                                src={userData.Profile}
                                alt="Profile"
                                style={{
                                    width: "160px",
                                    height: "160px",
                                    borderRadius: "50%",
                                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                                    objectFit: "cover",
                                    border: '4px solid #fff',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "160px",
                                    height: "160px",
                                    borderRadius: "50%",
                                    background: "#e0e0e0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "16px",
                                    color: "#888",
                                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)"
                                }}
                            >
                                No Profile Image
                            </div>
                        )}
                    </div>
                    <h2 style={{ margin: '0', fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                        {userData.first_name} {userData.last_name}
                    </h2>
                    <p style={{ margin: '4px 0', color: '#666', fontSize: '18px' }}>{userData.email}</p>
                </div>

                {/* Personal Info Section */}
                <Divider style={{ borderColor: '#d9d9d9', borderWidth: '1px' }}>Contact Information</Divider>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', color: '#333' }}>
                        <MailOutlined style={{ fontSize: '20px', marginRight: '10px', color: '#888' }} />
                        {userData.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', color: '#333' }}>
                        <PhoneOutlined style={{ fontSize: '20px', marginRight: '10px', color: '#888' }} />
                        {userData.Contact}
                    </div>
                </div>

                {/* Work Information Section */}
                <Divider style={{ borderColor: '#d9d9d9', borderWidth: '1px' }}>Company</Divider>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: "18px",
                    background: "rgba(255, 255, 255, 0.6)",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  // เพิ่มเงาเบาๆ ให้กับกล่องข้อมูล
                    lineHeight: '1.8',
                    color: '#444',
                    whiteSpace: 'pre-line',  // เพื่อให้การแสดงผล \n มีผลจริง
                    textAlign: 'center'  // ทำให้ข้อความอยู่ตรงกลาง
                }}>
                    {userData.company}
                </div>

                <Divider style={{ borderColor: '#d9d9d9', borderWidth: '1px' }}>ประสบการณ์จ้างงาน</Divider>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: "18px",
                    background: "rgba(255, 255, 255, 0.6)",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  // เพิ่มเงาเบาๆ ให้กับกล่องข้อมูล
                    lineHeight: '1.8',
                    color: '#444',
                    whiteSpace: 'pre-line',  // เพื่อให้การแสดงผล \n มีผลจริง
                    textAlign: 'center'  // ทำให้ข้อความอยู่ตรงกลาง
                }}>
                    {userData.experience} ปี
                </div>
            </Card>

            <Row justify="center" style={{ marginTop: "40px" }}>
                <Col>
                    <Space size="large">
                        <Button
                            type="primary"
                            style={{
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Shadow for the button
                                padding: '0 36px',
                                height: '50px',
                                fontSize: '16px',
                                background: '#007bff', // Standard red color
                                border: 'none',
                                transition: 'all 0.3s ease', // Transition effect for the button
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.transform = 'scale(1.05)'; // Scale up on hover
                                (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)'; // Increase shadow on hover
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.transform = 'scale(1)'; // Reset size
                                (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'; // Reset shadow
                            }}
                            onClick={() => navigate(-1)} // Navigate back
                        >
                            ย้อนกลับ
                        </Button>
                    </Space>
                </Col>
            </Row>
        </div>
    );
}

export default CustomerView;