import { Button, Col, Divider, Form, Input, Row, Space, message, InputNumber, } from "antd";
import { useNavigate } from "react-router-dom";
import { CreateWork } from "../../../../services/https";
import TextArea from "antd/es/input/TextArea";
import { WorkInterface } from "../../../../interfaces/work";
import { PlusOutlined } from "@ant-design/icons";

function CreateWorkPage() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: WorkInterface) => {
        try {
            let res = await CreateWork(values);
            if (res.status === 201) {
                messageApi.open({
                    type: "success",
                    content: res.data.message,
                });
                navigate("/work");
            } else {
                messageApi.open({
                    type: "error",
                    content: res.data.error || "An error occurred",
                });
            }
        } catch (error) {
            console.error("Error creating work:", error);
            messageApi.open({
                type: "error",
                content: "An error occurred while creating work.",
            });
        }
    };

    return (
        <>
            {contextHolder}
            <Row>
                <Col span={12}>
                    <h2>สร้างข้อมูลงาน</h2>
                </Col>
            </Row>
            <Divider />
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                layout="horizontal"
                onFinish={onFinish}
            >
                <Form.Item
                    label="รายละเอียดงาน"
                    name="info"
                    rules={[{ required: true, message: "กรุณากรอกรายละเอียดงาน!" }]}
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="ค่าจ้าง"
                    name="wages"
                    rules={[{ required: true, message: "กรุณากรอกค่าจ้าง!" }]}
                >
                    <InputNumber

                        min={0}

                        max={999999}

                        defaultValue={0}

                        style={{ width: "100%" }}

                    />
                </Form.Item>
                <Form.Item
                    label="ติดต่อ"
                    name="contact"
                    rules={[{ required: true, message: "กรุณากรอกข้อมูลติดต่อ!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="หมวดหมู่"
                    name="category"
                    rules={[{ required: true, message: "กรุณากรอกหมวดหมู่!" }]}
                >
                    <Input />
                </Form.Item>
                <Row>
                    <Col span={24} style={{ textAlign: "end" }}>
                        <Space>
                            <Button
                                htmlType="button"
                                onClick={() => navigate("/work")}
                            >
                                ย้อนกลับ
                            </Button>
                            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                                บันทึกข้อมูล
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default CreateWorkPage;