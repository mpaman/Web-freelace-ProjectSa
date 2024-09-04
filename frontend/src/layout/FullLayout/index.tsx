import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import { Avatar, Space } from 'antd';
import { UserOutlined, HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Button, message } from "antd";
import logo from "../../assets/logo.png";

import Dashboard from "../../pages/Customer/BookAjob/Home";
import Customer from "../../pages/Customer/BookAjob/customer";
// import CustomerCreate from "../../pages/customer/create";
// import CustomerEdit from "../../pages/customer/edit";
import Post from "../../pages/Customer/BookAjob/Post";
import Postjob from "../../pages/Customer/Post//Postjob";
import Promiss from "../../pages/Customer/BookAjob/Promiss";
import Sent from "../../pages/Customer/BookAjob/Sent";
import Getmon from "../../pages/Customer/BookAjob/Getmoney";
// import UnSent from "../../pages/dashboard";

//ของเพื่อนต้อง
import ResumeList from "../../pages/Resume";

import PersonalCreate from "../../pages/Resume/create/personal";
import StudyCreate from "../../pages/Resume/create/study";
import ExperienceCreate from "../../pages/Resume/create/experience";
import SkillCreate from "../../pages/Resume/create/skill";

import PersonalEdit from "../../pages/Resume/edit/personal";
import StudyEdit from "../../pages/Resume/edit/study";
import ExperienceEdit from "../../pages/Resume/edit/experience";
import SkillEdit from "../../pages/Resume/edit/skill";



const { Header, Content, Footer } = Layout;

const FullLayout: React.FC = () => {
    const page = localStorage.getItem("page");
    const [messageApi, contextHolder] = message.useMessage();

    const setCurrentPage = (val: string) => {
        localStorage.setItem("page", val);
    };

    const Logout = () => {
        localStorage.clear();
        messageApi.success("Logout successful");
        setTimeout(() => {
            location.href = "/";
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
                        <Button
                            type="text"
                            style={{ color: 'white', margin: '0 20px' }}
                            onClick={() => setCurrentPage("dashboard")}
                        >
                            <Link to="/">
                                <HomeOutlined style={{ color: 'white' }} />
                                <span style={{ color: 'white' }}> หน้าหลัก</span>
                            </Link>
                        </Button>

                        <Button
                            type="text"
                            style={{ color: 'white', margin: '0 10px' }}
                            onClick={() => setCurrentPage("post")}
                        >
                            <Link to="/Post">
                                <PlusOutlined style={{ color: 'white' }} />
                                <span style={{ color: 'white' }}> โพสงาน</span>
                            </Link>
                        </Button>

                        <Button
                            type="text"
                            style={{ color: 'white', margin: '0 10px' }}
                            onClick={() => setCurrentPage("customer")}
                        >
                            <Link to="/resume">
                                <UserOutlined style={{ color: 'white' }} />
                                <span style={{ color: 'white' }}> Resume</span>
                            </Link>
                        </Button>

                        <Button
                            type="text"
                            style={{ color: 'white', margin: '0 10px' }}
                            onClick={() => setCurrentPage("postjob")}
                        >
                            <Link to="/Postjob">
                                <UserOutlined style={{ color: 'white' }} />
                                <span style={{ color: 'white' }}> PostJob</span>
                            </Link>
                        </Button>

                        <Space wrap size={16}>
                            <Link to="/ProfileCustomer">
                                <Avatar
                                    onClick={() => setCurrentPage("ProfileCustomer")}
                                    size="large"
                                    icon={<UserOutlined />}
                                />
                            </Link>


                        </Space>
                        <p
                            style={{ color: 'white', margin: '0 10px' }}
                        >---Customer----</p>


                        <Space wrap size={16}>
                            <Link to="/ProfileFreelance">
                                <Avatar
                                    onClick={() => setCurrentPage("ProfileFreelance")}
                                    size="large" icon={<UserOutlined />} />
                            </Link>
                        </Space>
                        <p
                            style={{ color: 'white', margin: '0 10px' }}
                        >---Freelance----</p>

                        <Button
                            type="primary"
                            onClick={Logout}
                            style={{ marginLeft: '20px' }}
                        >
                            ออกจากระบบ
                        </Button>
                    </div>
                </Header>

                <Content style={{ margin: "16px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }} />
                    <div style={{ padding: 24, minHeight: "100%", background: '#f0f2f5' }}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/customer" element={<Customer />} />
                            {/* <Route path="/customer/create" element={<CustomerCreate />} />
                            <Route path="/customer/edit/:id" element={<CustomerEdit />} /> */}
                            <Route path="/Post" element={<Post />} />
                            <Route path="/promiss" element={<Promiss />} />
                            <Route path="/sent" element={<Sent />} />
                            <Route path="/getmon" element={<Getmon />} />
                            <Route path="/postjob" element={<Postjob />} />

                            <Route path="/resume" element={<ResumeList />} />
                            <Route path="/resume/create" element={<PersonalCreate />} />
                            <Route path="/resume/create/study" element={<StudyCreate />} />
                            <Route path="/resume/create/experience" element={<ExperienceCreate />} />
                            <Route path="/resume/create/skill" element={<SkillCreate />} />
                            <Route path="/resume/edit/personal" element={<PersonalEdit />} />
                            <Route path="/resume/edit/study" element={<StudyEdit />} />
                            <Route path="/resume/edit/experience" element={<ExperienceEdit />} />
                            <Route path="/resume/edit/skill" element={<SkillEdit />} />



                        </Routes>
                    </div>
                </Content>

                <Footer style={{ textAlign: "center" }}>
                    Freelance.com
                </Footer>
            </Layout>
        </Layout>
    );
};

export default FullLayout;
