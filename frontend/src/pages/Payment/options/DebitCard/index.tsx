import { useState, FormEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Card from 'antd/es/card/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreatePayment } from '../../../../services/https';
import { message } from 'antd';
import debit from '../../../../assets/DebitCard.png';

const DebitCard: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // รับข้อมูล workId, bookerUserId, posterUserId, wages จาก state
  const { workId, bookerUserId, posterUserId, wages } = location.state || { workId: null, bookerUserId: null, posterUserId: null, wages: null };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    // ข้ามการตรวจสอบความถูกต้อง
    event.preventDefault();

    // Gather payment data
    const paymentData = {
      work_id: workId,
      booker_user_id: bookerUserId,
      poster_user_id: posterUserId,
      wages: wages,
    };

    console.log("Sending payment data:", paymentData); // ตรวจสอบข้อมูลที่ส่ง

    try {
      const response = await CreatePayment(paymentData);
      if (response && response.status === 200) {
        message.success("Payment successfully processed!");
        navigate('/rating', { state: { workId, bookerUserId, posterUserId } });
      } else {
        console.error("Payment failed", response);
        message.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during payment", error);
      message.error("Error during payment. Please try again.");
    }

    setValidated(true);
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f0f2f5" }}>
      <Card
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          padding: "24px",
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={debit} alt="Debit Card" style={{ width: "220px" }} />
        </div>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3 justify-content-center">
            <Form.Group as={Col} md="8" controlId="validationCustom01">
              <Form.Label>Cardholder's Name</Form.Label>
              <Form.Control required type="text" placeholder="Name on card" />
            </Form.Group>
          </Row>

          <Row className="mb-3 justify-content-center">
            <Form.Group as={Col} md="8" controlId="validationCustom02">
              <Form.Label>Card Number</Form.Label>
              <Form.Control required type="text" placeholder="Card number" />
            </Form.Group>
          </Row>

          <Row className="mb-3 justify-content-center">
            <Form.Group as={Col} md="4" controlId="validationCustom03">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control required type="text" placeholder="MM/YY" />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationCustom04">
              <Form.Label>CVV</Form.Label>
              <Form.Control required type="text" placeholder="CVV" />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Form.Check
              required
              label="Agree to terms and conditions"
              feedback="You must agree before submitting."
              feedbackType="invalid"
              style={{ marginRight: '10px' }}
            />
          </Form.Group>

          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <Button type="submit">Submit</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default DebitCard;
