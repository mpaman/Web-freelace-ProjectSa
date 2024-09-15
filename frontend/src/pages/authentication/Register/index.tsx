import React from "react";
import {
    Button,
    Card,
    Form,
    Input,
    message,
    Row,
    Col,
    InputNumber,
    DatePicker,
    Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { CreateUser } from "../../../services/https";
import { UsersInterface } from "../../../interfaces/IUser";
import logo from "../../../assets/logologin.jpg";
import backgroundVideo from "../../../assets/back.mp4"; // Video background

function SignUpPages() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: UsersInterface) => {
        let res = await CreateUser(values);

        if (res.status === 201) {
            messageApi.open({
                type: "success",
                content: res.data.message,
            });
            setTimeout(function () {
                navigate("/");
            }, 2000);
        } else {
            messageApi.open({
                type: "error",
                content: res.data.error,
            });
        }
    };

    return (
        <>
            {contextHolder}

            {/* Background Video */}
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
                    filter: "brightness(0.6)", // Lower brightness to make content more visible
                }}
            >
                <source src={backgroundVideo} type="video/mp4" />
            </video>

            {/* Sign-Up Form */}
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card
                    className="card-signup"
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        padding: "20px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent background
                    }}
                >
                    <Row align={"middle"} justify={"center"} style={{ height: "100%" }}>
                        <Col xs={24} style={{ textAlign: "center", marginBottom: "20px" }}>
                            <img
                                alt="logo"
                                style={{ width: "60%", maxWidth: "200px" }}
                                src={logo}
                                className="images-logo"
                            />
                        </Col>
                        <Col xs={24}>
                            <h2 className="header">Sign Up</h2>
                            <Form
                                name="basic"
                                layout="vertical"
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Row gutter={[16, 0]} align={"middle"}>
                                    <Col xs={24}>
                                        <Form.Item
                                            label="First Name"
                                            name="first_name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter your first name!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item
                                            label="Last Name"
                                            name="last_name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter your last name!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[
                                                {
                                                    type: "email",
                                                    message: "The input is not valid email!",
                                                },
                                                {
                                                    required: true,
                                                    message: "Please enter your email!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter your password!",
                                                },
                                            ]}
                                        >
                                            <Input.Password />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Item
                                            label="Birthday"
                                            name="birthday"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select your birthday!",
                                                },
                                            ]}
                                        >
                                            <DatePicker style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Item
                                            label="Age"
                                            name="age"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter your age!",
                                                },
                                            ]}
                                        >
                                            <InputNumber min={0} max={100} style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Item
                                            label="Gender"
                                            name="gender_id"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please select your gender!",
                                                },
                                            ]}
                                        >
                                            <Select
                                                defaultValue=""
                                                style={{ width: "100%" }}
                                                options={[
                                                    { value: "", label: "Select Gender", disabled: true },
                                                    { value: 1, label: "Male" },
                                                    { value: 2, label: "Female" },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24}>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="signup-form-button"
                                                style={{ width: "100%" }}
                                            >
                                                Sign Up
                                            </Button>
                                            Or{" "}
                                            <a onClick={() => navigate("/")}>signin now!</a>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </div>
        </>
    );
}

export default SignUpPages;
