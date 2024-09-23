import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './payment.css';
import Card from 'react-bootstrap/Card';

import PromptPayLogo from '../../../assets/PromptP.png';
import debit from '../../../assets/DebitCard.png';

const PaymentOptions: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { workId, bookerUserId, posterUserId, wages } = location.state || { workId: null, bookerUserId: null, posterUserId: null, wages: null };

    const handleRedirect = (paymentMethod: string) => {
        console.log(`Selected payment method: ${paymentMethod}`);

        if (paymentMethod === 'PromptPay') {
            navigate('/payment/QRcodePayment', { state: { workId, bookerUserId, posterUserId, wages } });
        } else if (paymentMethod === 'DebitCard') {
            navigate('/payment/DebitCardPayment', { state: { workId, bookerUserId, posterUserId, wages } });
        }
    };

    return (
      <div style={{ padding: "60px", backgroundColor: "#f0f2f5" }}>
        <Card style={{ maxWidth: "1000px", margin: "0 auto", borderRadius: "20px", padding: "40px", backgroundColor: "#ffffff" }}>
          <div className="centered-text" style={{ marginTop: "80px", marginBottom: "80px" }}>
            <h1>เลือกช่องทางการชำระ</h1>
          </div>
          <div className="table-container">
            <div className="card-container">
              <Card className="custom-card" onClick={() => handleRedirect('PromptPay')} style={{ cursor: 'pointer' }}>
                <Card.Img variant="top" src={PromptPayLogo} />
                <Card.Body>
                  <Card.Title><h3>PROMPTPAY</h3></Card.Title>
                </Card.Body>
              </Card>
            </div>
            <div className="card-container">
              <Card className="custom-card" onClick={() => handleRedirect('DebitCard')} style={{ cursor: 'pointer' }}>
                <Card.Img variant="top" src={debit} />
                <Card.Body>
                  <Card.Title><h3>DEBIT CARD</h3></Card.Title>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    );
};

export default PaymentOptions;
