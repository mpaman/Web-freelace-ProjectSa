import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { CreatePayment } from '../../../../services/https'; // นำเข้า CreatePayment

function QR() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { workId, bookerUserId, posterUserId, wages } = location.state || { workId: null, bookerUserId: null, posterUserId: null, wages: null };
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const response = await axios.post('http://localhost:3000/generateQR', { amount: parseFloat(wages) });
        if (response.data && response.data.Result) {
          setQrCodeUrl(response.data.Result);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    
    if (wages) {
      generateQR();
    }
  }, [wages]);

  const handleNext = async () => {
    const paymentData = {
      work_id: workId,
      booker_user_id: bookerUserId,
      poster_user_id: posterUserId,
      wages: wages
    };

    try {
      await CreatePayment(paymentData); // บันทึกการชำระเงิน
      navigate('/rating', { state: { workId, bookerUserId, posterUserId } }); // นำทางไปยังหน้า Rating
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  return (
    <div style={{ 
      padding: "40px", 
      backgroundColor: "#f0f2f5", 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <Card style={{ 
        width: '90%',  // เพิ่มความกว้างของ Card
        maxWidth: "500px", // จำกัดความกว้างสูงสุด
        borderRadius: "20px", 
        padding: "30px", // เพิ่ม padding
        backgroundColor: "#ffffff", 
        textAlign: 'center' 
      }}>
        {qrCodeUrl ? (
          <>
            <Card.Img variant="top" src={qrCodeUrl} style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '500px', // เพิ่มความสูงสูงสุด
              objectFit: 'contain', 
              marginBottom: '20px' 
            }} />
            <Card.Title style={{ fontSize: '24px', fontWeight: 'bold' }}>PromptPay QR-code</Card.Title>
            <Button variant="primary" size="lg" onClick={handleNext}>เสร็จสิ้น</Button> {/* เพิ่มขนาดปุ่ม */}
          </>
        ) : (
          <p>Generating QR code...</p>
        )}
      </Card>
    </div>
  );
}

export default QR;
