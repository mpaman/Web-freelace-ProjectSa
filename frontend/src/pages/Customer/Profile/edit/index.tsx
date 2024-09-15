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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../../interfaces/IUser";
import { GetUserById, UpdateUsersById } from "../../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import ImgCrop from "antd-img-crop";

const { Title } = Typography;

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

  // Fetch provinces (assuming you have a service for this)
  const fetchProvinces = async () => {
    const res = await fetch('/api/provinces'); // Example endpoint
    const data = await res.json();
    setProvinces(data);
  };

  // Fetch subdistricts (assuming you have a service for this)
  const fetchSubdistricts = async () => {
    const res = await fetch('/api/subdistricts'); // Example endpoint
    const data = await res.json();
    setSubdistricts(data);
  };

  const fetchDistricts = async () => {
    const res = await fetch('/api/districts'); // Example endpoint
    const data = await res.json();
    setSubdistricts(data);
  };

  const fetchPostalcode = async () => {
    const res = await fetch('/api/subdistricts'); // Example endpoint
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

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const imgWindow = window.open(src);
    imgWindow.document.write(`<img src="${src}" />`);
  };

  const onFinish = async (values: UsersInterface) => {
    if (fileList.length > 0) {
      values.Profile = fileList[0].thumbUrl;
    }
    const payload = {
      ...values,
    };

    const res = await UpdateUsersById(id, payload);
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
    fetchProvinces(); // Fetch provinces when component mounts
    fetchSubdistricts(); // Fetch subdistricts when component mounts
    getUserById(id);
  }, [id]);

  return (
    <div style={{ padding: "40px", backgroundColor: "#f0f2f5" }}>
      {contextHolder}
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
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ชื่อจริง"
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อ !",
                  },
                ]}
              >
                <Input placeholder="ชื่อจริง" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="นามสกุล"
                name="last_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกนามสกุล !",
                  },
                ]}
              >
                <Input placeholder="นามสกุล" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="วัน/เดือน/ปี เกิด"
                name="birthday"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกวัน/เดือน/ปี เกิด !",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="อายุ"
                name="age"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกอายุ !",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={99}
                  defaultValue={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เพศ"
                name="gender_id"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเพศ !",
                  },
                ]}
              >
                <Select
                  defaultValue=""
                  style={{ width: "100%" }}
                  options={[
                    { value: "", label: "กรุณาเลือกเพศ", disabled: true },
                    { value: 1, label: "Male" },
                    { value: 2, label: "Female" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ที่อยู่"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกที่อยู่ !",
                  },
                ]}
              >
                <Input placeholder="ที่อยู่" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ตำบล"
                name="subdistrict"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกตำบล !",
                  },
                ]}
              >
                <Input placeholder="ตำบล" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="อำเภอ"
                name="district"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกอำเภอ !",
                  },
                ]}
              >
                <Input placeholder="อำเภอ" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="จังหวัด"
                name="province"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกจังหวัด !",
                  },
                ]}
              >
                <Input placeholder="จังหวัด" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="รหัสไปรษณีย์"
                name="postalcode"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรหัสไปรษณีย์ !",
                  },
                ]}
              >
                <Input placeholder="รหัสไปรษณีย์" />
              </Form.Item>
            </Col>    

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "รูปแบบอีเมลไม่ถูกต้อง !",
                  },
                  {
                    required: true,
                    message: "กรุณากรอกอีเมล !",
                  },
                ]}
              >
                <Input placeholder="example@email.com" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="Contact"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกเบอร์โทรศัพท์ !",
                  },
                ]}
              >
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="รูปประจำตัว" name="Profile">
                <ImgCrop rotationSlider>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    beforeUpload={() => false}
                    maxCount={1}
                    style={{ width: "100%" }}
                  >
                    {fileList.length < 1 && (
                      <div style={{ textAlign: "center" }}>
                        <PlusOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                        <div style={{ marginTop: 8, color: "#1890ff" }}>อัพโหลด</div>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col style={{ marginTop: "20px" }}>
              <Space size="middle">
                <Button
                  type="default"
                  style={{
                    borderRadius: "30px",
                    padding: "10px 20px",
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(255, 77, 79, 0.4)",
                    transition: "all 0.3s ease, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d32f2f";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(255, 77, 79, 0.6)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ff4d4f";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 77, 79, 0.4)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Link to="/customer" style={{ color: "#fff" }}>
                    ย้อนกลับ
                  </Link>
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    borderRadius: "30px",
                    padding: "10px 20px",
                    background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(91, 134, 229, 0.4)",
                    transition: "all 0.3s ease, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(91, 134, 229, 0.6)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(91, 134, 229, 0.4)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  บันทึก
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default CustomerEdit;
