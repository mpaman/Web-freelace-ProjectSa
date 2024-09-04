import { Button, Card, Form, Input, message, Flex, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../../services/https";
import { SignInInterface } from "../../../interfaces/SignIn";
import logo from "../../../assets/logologin.jpg";

function SignInPages() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: SignInInterface) => {
        let res = await SignIn(values);

        if (res.status === 200) {
            messageApi.success("Sign-in successful");
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("page", "dashboard");
            localStorage.setItem("token_type", res.data.token_type);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("id", res.data.id);
            setTimeout(() => {
                location.href = "/";
            }, 2000);
        } else {
            messageApi.error(res.data.error);
        }
    };

    return (
        <>
            {contextHolder}
            <Flex justify="center" align="center" className="login" style={{ minHeight: "100vh" }}>
                <Card 
                    className="card-login" 
                    style={{ width: "100%", maxWidth: "500px", padding: "20px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}
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
                            <Form
                                name="basic"
                                onFinish={onFinish}
                                autoComplete="off"
                                layout="vertical"
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: "Please input your username!" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: "Please input your password!" }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        style={{ width: "100%", marginBottom: 20 }}
                                    >
                                        Log in
                                    </Button>
                                    Or <a onClick={() => navigate("/signup")}>signup now !</a>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </Flex>
        </>
    );
}

export default SignInPages;
