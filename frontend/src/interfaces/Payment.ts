export interface PaymentInterface {
    id: number; // ID ของการชำระเงิน
    wages: number; // จำนวนเงินที่ชำระ
    booker_user_id: number; // ผู้ที่ให้
    poster_user_id: number; // ผู้ที่ถูกให้
    created_at: string; // วันที่สร้างการชำระเงิน
    work:  number;
}