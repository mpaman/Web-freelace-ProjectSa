export interface PostworkInterface {
  ID: number; // ID ของ Postwork
  id_user: number; // ID ของผู้ใช้ที่สร้างงาน
  id_work: number; // ID ของงาน

  User?: {
    ID: number; // ID ของผู้ใช้
    first_name: string; // ชื่อจริงของผู้ใช้
    last_name: string;  // นามสกุลของผู้ใช้
    email: string;      // อีเมลของผู้ใช้
    // เพิ่มฟิลด์อื่นๆ ของ Users ตามที่กำหนดใน Go struct
  };
  Work?: {
    ID: number; // ID ของงาน
    category: string; // ประเภทของงาน
    info: string;     // ข้อมูลของงาน
    contact?: string;   // ข้อมูลติดต่อ
    wages?: string;     // ค่าจ้างของงาน
  };
}
