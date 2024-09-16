import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Avatar, Space, Button, message, Breadcrumb, Layout, } from "antd";
import { UserOutlined, HomeOutlined, PlusOutlined, BellOutlined, BookOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import Dashboard from "../../pages/Customer/BookAjob/Home";
import Post from "../../pages/Customer/BookAjob/Post";
import Postwork from "../../pages/Freelance/Post";
import Editwork from "../../pages/Freelance/Post/edit";
import Creatework from "../../pages/Freelance/Post/create";
import Inpost from "../../pages/Customer/BookAjob/Inpost";
import Managebooking from "../../pages/Customer/BookAjob/managebooking";
import Sent from "../../pages/Customer/BookAjob/Sent";
import Getwork from "../../pages/Customer/BookAjob/Getwork";
import Booking from "../../pages/Customer/BookAjob/Bookingwork";
import Customer from "../../pages/Customer/Profile/index";


//profile
import CustomerEdit from "../../pages/Customer/Profile/edit/index";
import ProfileCustomer from "../../pages/Customer/Profile/profile/index";

//resume
import Resume from "../../pages/Freelance/Resume";
import ResumeEdit from "../../pages/Freelance/Resume/edit";
import ResumeView from "../../pages/Freelance/Resume/view";

const { Header, Content, Footer } = Layout;

const FullLayout: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const Logout = () => {
        localStorage.clear();
        messageApi.success("Logout successful");
        setTimeout(() => {
            window.location.href = "/";
        }, 2000);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {contextHolder}
            <Layout>
                <Header style={{ background: '#06579b', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ width: 50, margin: '0 10px' }} />
                        <h1 style={{ color: 'white', margin: '0 10px' }}>Caylance</h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                        <Button type="text" style={{ color: 'white', margin: '0 20px' }}>
                            <Link to="/">
                                <HomeOutlined style={{ color: 'white' }} />
                                <span> หน้าหลัก</span>
                            </Link>
                        </Button>

                        <Button type="text" style={{ color: 'white', margin: '0 10px' }}>
                            <Link to="/works">
                                <BookOutlined style={{ color: 'white' }} />
                                <span> ข้อมูลงานที่โพส</span>
                            </Link>
                        </Button>

                        <Button type="text" style={{ color: 'white', margin: '0 10px' }}>
                            <Link to="/resume">
                                <UserOutlined style={{ color: 'white' }} />
                                <span> Resume</span>
                            </Link>
                        </Button>

                        <Button type="text" style={{ color: 'white', margin: '0 10px' }}>
                            <Link to="/work">
                                <PlusOutlined style={{ color: 'white' }} />
                                <span> โพสงาน</span>
                            </Link>
                        </Button>

                        <Button type="text" style={{ color: 'white', margin: '0 10px' }}>
                            <Link to="/bookingbyF">
                                <BellOutlined style={{ color: 'white' }} />
                                <span> ติดตามการจอง</span>
                            </Link>
                        </Button>




                        <Link to="/customer">  {/* ลิงก์ไปยังหน้าโปรไฟล์ */}
                            <Avatar
                                style={{
                                    backgroundColor: '#1890ff',
                                    marginLeft: '20px',
                                    cursor: 'pointer'
                                }}
                                icon={<UserOutlined />}
                            />
                        </Link>




                        <Button type="primary" onClick={Logout} style={{ marginLeft: '20px' }}>
                            ออกจากระบบ
                        </Button>
                    </div>
                </Header>

                <Content style={{ margin: "16px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }} />
                    <div style={{ padding: 24, minHeight: "100%", background: '#f0f2f5' }}>
                        <Routes>

                            <Route path="/customer" element={<Customer />} />
                            {/* <Route path="/customer/create" element={<CustomerCreate />} /> */}
                            <Route path="/customer/edit/:id" element={<CustomerEdit />} />
                            <Route path="/customer/profile/:id" element={<ProfileCustomer />} />

                            <Route path="/" element={<Dashboard />} />
                            <Route path="/post/:postId" element={<Inpost />} />
                            <Route path="/bookingbyF" element={<Booking />} />

                            <Route path="/works" element={<Post />} />
                            <Route path="/works/:id/bookings" element={<Managebooking />} />
                            <Route path="/works/:id/track" element={<Getwork />} />

                            <Route path="/submissions" element={<Getwork />} />
                            <Route path="/post/:postId/sent" element={<Sent />} />

                            <Route path="/work" element={<Postwork />} />
                            <Route path="/work/create" element={<Creatework />} />
                            <Route path="/work/edit/:id" element={<Editwork />} />

                            <Route path="/resume" element={<Resume />} />
                            <Route path="/resume/edit/:id" element={<ResumeEdit />} />
                            <Route path="/resume/view/:id" element={<ResumeView />} />

                        </Routes>
                    </div>
                </Content>

                <Footer style={{ textAlign: "center" }}>Freelance.com</Footer>
            </Layout>
        </Layout>
    );
};

export default FullLayout;
