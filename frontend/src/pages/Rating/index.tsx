import React, { useState } from 'react';
import './Rating.css'; // Import the CSS file for styling
import { Rate, message } from 'antd';
import Button from 'react-bootstrap/Button';
import Card from 'antd/es/card/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateRating } from '../../services/https';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const Rating: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const navigate = useNavigate();
  
  // รับค่า booker_user_id และ poster_user_id ที่ส่งมาจากหน้า ManageSubmissions
  const { bookerUserId, posterUserId } = location.state || {};

  const [rating, setRating] = useState<number>(3); // Default rating is 3 stars
  const [comment, setComment] = useState<string>('');

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ratingData = {
      score: rating,
      comment: comment,
      booker_user_id: bookerUserId,
      poster_user_id: posterUserId,
    };

    try {
      const res = await CreateRating(ratingData);
      if (res.status === 200 || res.status === 201) {
        messageApi.open({
          type: "success",
          content: 'การให้เรตติ้งสำเร็จ',
        });
        navigate('/');
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error || "เกิดข้อผิดพลาดในการให้เรตติ้ง",
        });
      }
    } catch (error) {
      console.error('Error creating rating:', error);
      messageApi.open({
        type: "error",
        content: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ padding: "60px", backgroundColor: "#f0f2f5" }}>
        <Card
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            padding: "60px",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <div className="rating-container">
            <h1>Rate Us</h1>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '18px' }}>
              ขอบคุณที่ใช้ capylance
            </div>
            <div className="stars" style={{ textAlign: 'center', fontSize: '32px' }}>
              <Rate tooltips={desc} onChange={setRating} value={rating} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '18px' }}>
              {rating ? <span>{desc[rating - 1]}</span> : null}
            </div>
            <p>Your rating: {rating} {rating === 1 ? 'star' : 'stars'}</p>
            <form onSubmit={handleSubmit}>
              <div className="comment-section">
                <label htmlFor="comment">Comment:</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={handleCommentChange}
                  rows={5}
                  placeholder="แสดงความคิดเห็นของคุณ"
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "25px" }}>
                <Button type="submit">ยืนยัน</Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Rating;
