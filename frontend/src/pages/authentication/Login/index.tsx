import React, { useRef, useEffect, useState } from "react";
import { Button, Card, Form, Input, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../../services/https";
import { SignInInterface } from "../../../interfaces/SignIn";
import logo from "../../../assets/logologin.jpg"; // รูปโลโก้
import videoBg from "../../../assets/back.mp4"; // วิดีโอพื้นหลัง
import bgMusic from "../../../assets/music.mp3"; // เพลงพื้นหลัง

function SignInPages() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(true); // สถานะการเล่นเพลง

    useEffect(() => {
        if (audioRef.current) {
            // ตั้งค่าระดับเสียงที่ 2%
            audioRef.current.volume = 0.02; // ระดับเสียง 0.02 = 2%
        }
    }, []);

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

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            {contextHolder}

            {/* วิดีโอพื้นหลัง */}
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
                    filter: "brightness(0.6)" // ลดความสว่างของวิดีโอเพื่อให้เนื้อหาชัดเจนขึ้น
                }}
            >
                <source src={videoBg} type="video/mp4" />
            </video>

            {/* เพลงพื้นหลัง */}
            <audio ref={audioRef} autoPlay loop>
                <source src={bgMusic} type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>

            {/* ปุ่มหยุดเพลง */}
            <Button
                onClick={toggleAudio}
                style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    zIndex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.5)", // สีพื้นหลังโปร่งใส
                    border: "1px solid rgba(255, 255, 255, 0.5)", // ขอบของปุ่มโปร่งใส
                    color: "white", // สีของข้อความบนปุ่ม
                    backdropFilter: "blur(5px)" // เพิ่มเอฟเฟกต์เบลอพื้นหลัง
                }}
            >
                {isPlaying ? "Stop Music" : "Play Music"}
            </Button>

            {/* ฟอร์มล็อกอิน */}
            <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Card
                    className="card-login"
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        padding: "20px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.9)" // ทำให้พื้นหลังของการ์ดโปร่งใสเล็กน้อย
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
                            <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
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
                                    Or <a onClick={() => navigate("/signup")}>signup now!</a>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </div>
        </>
    );
}

export default SignInPages;
