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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import ImgCrop from "antd-img-crop";
import { UsersInterface } from "../../../../interfaces/IUser";
import { CreateUser } from "../../../../services/https";
import { useNavigate, Link } from "react-router-dom";

function CustomerCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);

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
    let res = await CreateUser(values);

    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(function () {
        navigate("/customer");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const provinces = [
    { value: "Bangkok", label: "กรุงเทพมหานคร" },
    { value: "ChiangMai", label: "เชียงใหม่" },
    { value: "Phuket", label: "ภูเก็ต" },
    { value: "ChiangRai", label: "เชียงราย" },
    { value: "NakhonRatchasima", label: "นครราชสีมา" },
    { value: "KhonKaen", label: "ขอนแก่น" },
    { value: "UdonThani", label: "อุดรธานี" },
    { value: "NakhonPhanom", label: "นครพนม" },
    { value: "NakhonSawan", label: "นครสวรรค์" },
    { value: "Sukhothai", label: "สุโขทัย" },
    { value: "PrachuapKhiriKhan", label: "ประจวบคีรีขันธ์" },
    { value: "Phetchaburi", label: "เพชรบุรี" },
    { value: "Phetchabun", label: "เพชรบูรณ์" },
    { value: "Lampang", label: "ลำปาง" },
    { value: "Loei", label: "เลย" },
    { value: "MaeHongSon", label: "แม่ฮ่องสอน" },
    { value: "NongKhai", label: "หนองคาย" },
    { value: "SakonNakhon", label: "สกลนคร" },
    { value: "UbonRatchathani", label: "อุบลราชธานี" },
    { value: "Yasothon", label: "ยโสธร" },
    { value: "AmnatCharoen", label: "อำนาจเจริญ" },
    { value: "BuengKan", label: "บึงกาฬ" },
    { value: "Chaiyaphum", label: "ชัยภูมิ" },
    { value: "Surin", label: "สุรินทร์" },
    { value: "Buriram", label: "บุรีรัมย์" },
    { value: "SiSaKet", label: "ศรีสะเกษ" },
    { value: "RoiEt", label: "ร้อยเอ็ด" },
    { value: "Kalasin", label: "กาฬสินธุ์" },
    { value: "MahaSarakham", label: "มหาสารคาม" },
    { value: "NakhonSiThammarat", label: "นครศรีธรรมราช" },
    { value: "Songkhla", label: "สงขลา" },
    { value: "Yala", label: "ยะลา" },
    { value: "Pattani", label: "ปัตตานี" },
    { value: "Narathiwat", label: "นราธิวาส" },
    { value: "Trang", label: "ตรัง" },
    { value: "Satun", label: "สตูล" },
    { value: "Ranong", label: "ระนอง" },
    { value: "SuratThani", label: "สุราษฎร์ธานี" },
    { value: "Chumphon", label: "ชุมพร" },
    { value: "Ratchaburi", label: "ราชบุรี" },
    { value: "Kanchanaburi", label: "กาญจนบุรี" },
    { value: "Saraburi", label: "สระบุรี" },
    { value: "Singburi", label: "สิงห์บุรี" },
    { value: "AngThong", label: "อ่างทอง" },
    { value: "SuphanBuri", label: "สุพรรณบุรี" },
    { value: "NakhonPathom", label: "นครปฐม" },
    { value: "Nonthaburi", label: "นนทบุรี" },
    { value: "PathumThani", label: "ปทุมธานี" },
    { value: "SamutPrakan", label: "สมุทรปราการ" },
    { value: "SamutSakhon", label: "สมุทรสาคร" },
    { value: "SamutSongkhram", label: "สมุทรสงคราม" },
    { value: "NakhonNayok", label: "นครนายก" },
    { value: "PrachinBuri", label: "ปราจีนบุรี" },
    { value: "Chachoengsao", label: "ฉะเชิงเทรา" },
    { value: "Chonburi", label: "ชลบุรี" },
    { value: "Rayong", label: "ระยอง" },
    { value: "Chanthaburi", label: "จันทบุรี" },
    { value: "Trat", label: "ตราด" }
  ];

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>สร้างโปรไฟล์ลูกค้า</h2>
        <Divider />

        <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 0]}>
            {/* First Name */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ชื่อจริง"
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อจริง!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Last Name */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="นามสกุล"
                name="last_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกนามสกุล!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Birthday */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="วัน/เดือน/ปี เกิด"
                name="birthday"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกวัน/เดือน/ปี เกิด!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* Age */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="อายุ"
                name="age"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกอายุ!",
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

            {/* Gender */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เพศ"
                name="gender_id"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเพศ!",
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

            {/* Address */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ที่อยู่"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกที่อยู่!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Province */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="จังหวัด"
                name="province"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกจังหวัด!",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={provinces}
                />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "รูปแบบอีเมลไม่ถูกต้อง!",
                  },
                  {
                    required: true,
                    message: "กรุณากรอกอีเมล!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Contact */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="Contact"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกเบอร์โทรศัพท์!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            {/* Profile Picture Upload */}
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="รูปประจำตัว" name="Profile">
                <ImgCrop rotationSlider>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    beforeUpload={() => false} // Prevent immediate upload
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

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/customer">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>

                  <Button type="primary" htmlType="submit">
                    ยืนยัน
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

export default CustomerCreate;
