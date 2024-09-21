import { useState, useEffect } from "react";
import { Button, Col, Row, Divider, message, Card, Typography, Image, Layout } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GetResume, GetUsers, DeleteResumeById } from "../../../services/https/index";
import videoBg from "../../../assets/back.mp4";
const { Title } = Typography;
const { Content } = Layout;

interface Personal {
    first_name: string;
    last_name: string;
    address: string;
    province: string;
    phone_number: string;
    email: string;
    Profile?: string;
}

interface Study {
    education: string;
    institution: string;
    year: string;
}

interface Experience {
    JobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
}

interface Skill {
    skill1: string;
    level1: number;
    skill2: string;
    level2: number;
    skill3: string;
    level3: number;
}

interface Resume {
    ID: string;
    personal: Personal;
    study: Study;
    experience: Experience;
    skill: Skill;
}

const getDisplayValue = (value: string | undefined | null, defaultValue: string = '-') => {
    return value ?? defaultValue;
};

// ฟังก์ชันสำหรับจัดการกับวันที่
const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '-';

    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('th-TH', options); // แสดงวันที่ในรูปแบบภาษาไทย
};

const ResumeMain = () => {
    const [resumeData, setResumeData] = useState<Resume[]>([]);
    const [filteredData, setFilteredData] = useState<Resume[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [searchText, setSearchText] = useState<string>('');
    const navigate = useNavigate();
    const myId = localStorage.getItem("id") || "";

    const handleDelete = async (id: string) => {
        try {
            let res = await DeleteResumeById(id);
            if (res.status === 200) {
                messageApi.open({
                    type: "success",
                    content: res.data.message,
                });
                await getResumeData();
            } else {
                messageApi.open({
                    type: "error",
                    content: res.data.error,
                });
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดที่ไม่คาดคิด.",
            });
        }
    };

    const getResumeData = async () => {
        try {
            const usersRes = await GetUsers();
            if (usersRes.status === 200) {
                const user = usersRes.data.find((u: { ID: string; resume_id: string }) => u.ID!.toString() === myId);
                if (user && user.resume_id) {
                    const resumeRes = await GetResume();
                    if (resumeRes.status === 200) {
                        const userResume = resumeRes.data.find((r: Resume) => r.ID === user.resume_id);
                        if (userResume) {
                            setResumeData([userResume]);
                            setFilteredData([userResume]);
                        }
                    }
                }
            }
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดที่ไม่คาดคิด.",
            });
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        if (value) {
            const filtered = resumeData.filter(resume => {
                return (getDisplayValue(resume.personal?.first_name).toLowerCase().includes(value) ||
                    getDisplayValue(resume.personal?.last_name).toLowerCase().includes(value) ||
                    getDisplayValue(resume.experience?.JobTitle).toLowerCase().includes(value));
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(resumeData);
        }
    };

    useEffect(() => {
        getResumeData();
    }, []);

    return (
        <Layout>
            {contextHolder}
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
            <Content style={{ padding: '20px', backgroundColor: '#f7f9fc' }}>
                <Row gutter={16} style={{ textAlign: "center", marginBottom: '20px' }}>
                    <Col span={24}>
                        <Title level={2} style={{ color: '#06579b', fontSize: '80px', textTransform: 'uppercase', letterSpacing: '10px', fontWeight: 'bold' }}>
                            RESUME
                        </Title>
                        <Divider style={{ backgroundColor: '#06579b', height: '2px', width: '50%', margin: '0 auto' }} />
                    </Col>
                </Row>
                <Card style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '20px' }}>
                    <Row gutter={16} style={{ justifyContent: 'center' }}>
                        {filteredData.map((resume) => (
                            <Col span={8} key={resume.ID} style={{ marginBottom: 16 }}>
                                <Card
                                    style={{
                                        borderRadius: '10px',
                                        border: '1px solid #06579b',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    }}
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ flexShrink: 0, marginRight: '16px' }}>
                                                {resume.personal?.Profile && (
                                                    <Image
                                                        width={120}
                                                        height={120}
                                                        src={resume.personal.Profile}
                                                        alt="Profile"
                                                        style={{ borderRadius: '80%', border: '1px solid #06579b' }}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '20px', color: '#333' }}>
                                                    {`${getDisplayValue(resume.personal?.first_name, '-')}`} {`${getDisplayValue(resume.personal?.last_name, '-')}`}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    extra={
                                        <div>
                                            <Button
                                                type="primary"
                                                icon={<EyeOutlined />}
                                                onClick={() => navigate(`/resume/view/${resume.ID}`)}
                                                style={{ marginRight: 8, backgroundColor: '#06579b', borderColor: '#06579b', borderRadius: '5px' }}
                                            >
                                                ดู
                                            </Button>
                                            <Button
                                                type="primary"
                                                icon={<EditOutlined />}
                                                onClick={() => navigate(`/resume/edit/${resume.ID}`)}
                                                style={{ marginRight: 8, backgroundColor: '#06579b', borderColor: '#06579b', borderRadius: '5px' }}
                                            >
                                                แก้ไข
                                            </Button>
                                        </div>
                                    }
                                >
                                    <div style={{ fontSize: '16px', color: '#555' }}>
                                        <p><strong>ที่อยู่:</strong> {getDisplayValue(resume.personal?.address)}</p>
                                        <p><strong>จังหวัด:</strong> {getDisplayValue(resume.personal?.province)}</p>
                                        <p><strong>โทรศัพท์:</strong> {getDisplayValue(resume.personal?.phone_number)}</p>
                                        <p><strong>อีเมล:</strong> {getDisplayValue(resume.personal?.email)}</p>
                                        <p><strong>ตำแหน่ง:</strong> {getDisplayValue(resume.experience?.JobTitle)}</p>
                                        <p><strong>บริษัท:</strong> {getDisplayValue(resume.experience?.company)}</p>
                                        <p><strong>วันที่:</strong> {formatDate(resume.experience?.startDate)} ถึง {formatDate(resume.experience?.endDate)}</p>
                                        <p><strong>การศึกษา:</strong> {getDisplayValue(resume.study?.education)} ที่ {getDisplayValue(resume.study?.institution)} ({getDisplayValue(resume.study?.year)})</p>
                                        <p><strong>ทักษะ:</strong></p>
                                        <p>{getDisplayValue(resume.skill?.skill1)}: {resume.skill?.level1 ?? 0}%</p>
                                        <p>{getDisplayValue(resume.skill?.skill2)}: {resume.skill?.level2 ?? 0}%</p>
                                        <p>{getDisplayValue(resume.skill?.skill3)}: {resume.skill?.level3 ?? 0}%</p>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </Content>
        </Layout>
    );
};

export default ResumeMain;