import { useEffect, useState } from "react";
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
  DatePicker,
  InputNumber,
  Select,
  Upload,
  Typography,
  Tabs,
  Slider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../../interfaces/IUser";
import { GetUserById, UpdateUsersById } from "../../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import ImgCrop from "antd-img-crop";
import videoBg from "../../../../assets/back.mp4";

const { Title } = Typography;
const { TabPane } = Tabs;

function CustomerEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [postalcode, setPostalcode] = useState([]);

  // Fetch data (example placeholders)
  const fetchProvinces = async () => {
    const res = await fetch("/api/provinces");
    const data = await res.json();
    setProvinces(data);
  };
  const fetchSubdistricts = async () => {
    const res = await fetch("/api/subdistricts");
    const data = await res.json();
    setSubdistricts(data);
  };

  const getUserById = async (id: string) => {
    let res = await GetUserById(id);
    if (res.status === 200) {
      form.setFieldsValue({
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        email: res.data.email,
        birthday: dayjs(res.data.birthday),
        age: res.data.age,
        gender_id: res.data.gender?.ID,
        company: res.data.company,
        address: res.data.address,
        province: res.data.province,
        subdistrict: res.data.subdistrict,
        district: res.data.district,
        postalcode: res.data.postalcode,
        Contact: res.data.Contact,
      });
      if (res.data.Profile) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: res.data.Profile,
            thumbUrl: res.data.Profile,
          },
        ]);
      }
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลผู้ใช้",
      });
      setTimeout(() => {
        navigate("/customer");
      }, 2000);
    }
  };

  const onChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const onFinish = async (values: UsersInterface) => {
    if (fileList.length > 0) {
      values.Profile = fileList[0].thumbUrl;
    }

    const res = await UpdateUsersById(id, values);
    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/customer");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    fetchProvinces();
    fetchSubdistricts();
    getUserById(id);
  }, [id]);

  return (
    <div style={{ padding: "40px", backgroundColor: "#f0f2f5" }}>
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
          maxWidth: "800px",
          margin: "0 auto",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          padding: "24px",
          backgroundColor: "#ffffff",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          โปรไฟล์
        </Title>
        <Divider />

        {/* Single Form across Tabs */}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Tabs defaultActiveKey="1">
            {/* Personal Info Tab */}
            <TabPane tab="ข้อมูลส่วนตัว" key="1">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="ชื่อจริง"
                    name="first_name"
                    rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
                  >
                    <Input placeholder="ชื่อจริง" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="นามสกุล"
                    name="last_name"
                    rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
                  >
                    <Input placeholder="นามสกุล" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="วัน/เดือน/ปี เกิด"
                    name="birthday"
                    rules={[{ required: true, message: "กรุณาเลือกวัน/เดือน/ปี เกิด !" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="อายุ"
                    name="age"
                    rules={[{ required: true, message: "กรุณากรอกอายุ !" }]}
                  >
                    <InputNumber min={0} max={99} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="เพศ"
                    name="gender_id"
                    rules={[{ required: true, message: "กรุณาเลือกเพศ !" }]}
                  >
                    <Select
                      options={[
                        { value: 1, label: "Male" },
                        { value: 2, label: "Female" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item label="บริษัท" name="company">
                    <Input placeholder="บริษัท" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="เบอร์โทร"
                    name="Contact"
                    rules={[{ required: true, message: "กรุณากรอกเบอร์โทร !" }]}
                  >
                    <Input placeholder="เบอร์โทร" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="อีเมล"
                    name="email"
                    rules={[{ required: true, message: "กรุณากรอกอีเมล !" }]}
                  >
                    <Input placeholder="อีเมล" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item label="รูปประจำตัว" name="Profile">
                    <ImgCrop rotationSlider>
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        beforeUpload={() => false}
                        maxCount={1}
                      >
                        {fileList.length < 1 && (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>อัพโหลด</div>
                          </div>
                        )}
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* Address Info Tab */}
            <TabPane tab="ที่อยู่" key="2">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="ที่อยู่"
                    name="address"
                    rules={[{ required: true, message: "กรุณากรอกที่อยู่ !" }]}
                  >
                    <Input placeholder="ที่อยู่" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="ตำบล"
                    name="subdistrict"
                    rules={[{ required: true, message: "กรุณากรอกตำบล !" }]}
                  >
                    <Input placeholder="ตำบล" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="อำเภอ"
                    name="district"
                    rules={[{ required: true, message: "กรุณากรอกอำเภอ !" }]}
                  >
                    <Input placeholder="อำเภอ" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="จังหวัด"
                    name="province"
                    rules={[{ required: true, message: "กรุณาเลือกจังหวัด !" }]}
                  >
                    <Input placeholder="จังหวัด" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="รหัสไปรษณีย์"
                    name="postalcode"
                    rules={[{ required: true, message: "กรุณากรอกรหัสไปรษณีย์ !" }]}
                  >
                    <Input placeholder="รหัสไปรษณีย์" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="ประสบการณ์" key="3">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="ประสบการณ์จ้างงาน (ปี)"
                  name="experience"
                  rules={[{ required: true, message: "กรุณาเลือกประสบการณ์ !" }]}
                >
                  <Slider
                    min={0}
                    max={30}
                    step={1}
                    marks={{
                      0: '0 ปี',
                      10: '10 ปี',
                      20: '20 ปี',
                      30: '30 ปี',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          </Tabs>

          <Form.Item style={{ textAlign: "center", marginTop: "24px" }}>
            <Space size="large">
              <Button
                type="default"
                onClick={() => navigate(-1)} // This will navigate back one page
                style={{
                  width: "200px",
                  borderRadius: "30px",
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  transition: "background-color 0.3s",
                  border: "none", // Remove the border
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#d32f2f";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(255, 77, 79, 0.6)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ff4d4f";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 77, 79, 0.6)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ย้อนกลับ
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "200px",
                  borderRadius: "30px",
                  background: "#00BFFF",
                  border: "none",
                  transition: "box-shadow 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#003366";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(91, 134, 229, 0.6)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#00BFFF";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(91, 134, 229, 0.4)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default CustomerEdit;