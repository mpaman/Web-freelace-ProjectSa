import { useEffect } from "react";
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
    InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { WorkInterface } from "../../../../interfaces/work";
import { GetWorkById, UpdateWorkById } from "../../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import videoBg from "../../../../assets/back.mp4";
function WorkEdit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const getWorkById = async (id: string) => {
        let res = await GetWorkById(id);

        if (res.status === 200) {
            form.setFieldsValue({
                work_id: res.data.work_id,
                info: res.data.info,
                wages: res.data.wages,
                contact: res.data.contact,
                category: res.data.category,
            });
        } else {
            messageApi.open({
                type: "error",
                content: "ไม่พบข้อมูลงาน",
            });
            setTimeout(() => {
                navigate("/work");
            }, 2000);
        }
    };

    const onFinish = async (values: WorkInterface) => {
        const res = await UpdateWorkById(id!, values);

        if (res.status === 200) {
            messageApi.open({
                type: "success",
                content: "บันทึกข้อมูลสำเร็จ",
            });
            setTimeout(() => {
                navigate("/work");
            }, 2000);
        } else {
            messageApi.open({
                type: "error",
                content: res.data.error,
            });
        }
    };

    useEffect(() => {
        if (id) {
            getWorkById(id);
        }
    }, [id]);

    return (
        <div style={{ padding: "20px" }}>
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
                    filter: "brightness(0.6)", // Reduce brightness for contrast
                }}
            >
                <source src={videoBg} type="video/mp4" />
            </video>
            <Row justify="center" style={{ marginBottom: "20px" }}>
                <Col span={24}>
                    <h2 style={{ textAlign: "center" }}>แก้ไขข้อมูลงาน</h2>
                </Col>
            </Row>
            <Divider />
            <Card bordered={false} style={{ maxWidth: "800px", margin: "auto" }}>
                <Form
                    name="work-edit"
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={[16, 24]}>
                        <Col span={24}>
                            <Form.Item
                                label="รายละเอียดงาน"
                                name="info"
                                rules={[{ required: true, message: "กรุณากรอกรายละเอียดงาน!" }]}
                            >
                                <Input.TextArea
                                    style={{ width: "100%", height: "200px" }}  // Apply width and height here
                                    placeholder="กรุณากรอกรายละเอียดงาน"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="ค่าจ้าง"
                                name="wages"
                                rules={[{ required: true, message: "กรุณากรอกค่าจ้าง!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={10000000}
                                    style={{ width: "100%" }}
                                    placeholder="กรุณากรอกค่าจ้าง"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="ข้อมูลการติดต่อ"
                                name="contact"
                                rules={[{ required: true, message: "กรุณากรอกข้อมูลการติดต่อ!" }]}
                            >
                                <Input placeholder="กรุณากรอกข้อมูลการติดต่อ" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="หมวดหมู่"
                                name="category"
                                rules={[{ required: true, message: "กรุณากรอกหมวดหมู่!" }]}
                            >
                                <Input placeholder="กรุณากรอกหมวดหมู่" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="end" style={{ marginTop: "20px" }}>
                        <Col>
                            <Form.Item>
                                <Space>
                                    <Link to="/work">
                                        <Button htmlType="button" style={{ marginRight: "10px" }}>
                                            ยกเลิก
                                        </Button>
                                    </Link>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<PlusOutlined />}
                                    >
                                        บันทึก
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

export default WorkEdit;
