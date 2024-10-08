package users

import (
	"errors"

	"net/http"

	"time"

	"github.com/gin-gonic/gin"

	"golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"

	"example.com/sa-67-example/config"

	"example.com/sa-67-example/entity"

	"example.com/sa-67-example/services"
)

type (
	Authen struct {
		Email string `json:"email"`

		Password string `json:"password"`
	}

	signUp struct {
		FirstName string `json:"first_name"`

		LastName string `json:"last_name"`

		Email string `json:"email"`

		Age uint8 `json:"age"`

		Password string `json:"password"`

		BirthDay time.Time `json:"birthday"`

		GenderID uint `json:"gender_id"`

		Address string `json:"address"`

		Category string `json: "category"`

		Wages uint `json: "wages"`

		Contact string `json: "contact"`

		Profile string `gorm:"type:longtext"`

		Role string `json:"role"`
	}
)

func SignUp(c *gin.Context) {

	var payload signUp

	// Bind JSON payload to the struct

	if err := c.ShouldBindJSON(&payload); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	db := config.DB()

	var userCheck entity.Users

	// Check if the user with the provided email already exists

	result := db.Where("email = ?", payload.Email).First(&userCheck)
//คำสั่ง result := db.Where("email = ?", payload.Email).First(&userCheck) ใช้เพื่อค้นหาข้อมูลผู้ใช้ในตาราง Users โดยใช้ อีเมล ที่ได้รับจาก payload.Email
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
//โค้ดส่วนนี้ตรวจสอบว่ามีข้อผิดพลาดเกิดขึ้นระหว่างการค้นหาหรือไม่
		// If there's a database error other than "record not found"

		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})

		return

	}

	if userCheck.ID != 0 {

		// If the user with the provided email already exists

		c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})

		return

	}

	// Hash the user's password

	hashedPassword, _ := config.HashPassword(payload.Password)

	// Create a new user

	user := entity.Users{

		FirstName: payload.FirstName,

		LastName: payload.LastName,

		Email: payload.Email,

		Age: payload.Age,

		Password: hashedPassword,

		BirthDay: payload.BirthDay,

		GenderID: payload.GenderID,

		Contact: payload.Contact,

		Profile: payload.Profile,

		Role: payload.Role,
	}

	// Save the user to the database

	if err := db.Create(&user).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	resume := entity.Resume{
		PersonalID:   0, // ตั้งค่า PersonalID เป็น 0
		StudyID:      0,
		ExperienceID: 0,
		SkillID:      0,
	}

	if err := db.Create(&resume).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create resume"})
		return
	}

	user.ResumeID = resume.ID
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user with resume ID"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})

}

func SignIn(c *gin.Context) {
//การเข้าสู่ระบบ (Sign In) ของผู้ใช้ โดยการตรวจสอบอีเมลและรหัสผ่านที่ผู้ใช้กรอกเข้ามา หากถูกต้อง 
//จะสร้าง JWT Token เพื่อใช้ในกระบวนการยืนยันตัวตนในอนาคต และส่งข้อมูล JWT Token กลับไปยังผู้ใช้
	var payload Authen

	var user entity.Users

	if err := c.ShouldBindJSON(&payload); err != nil {
//ใช้คำสั่ง c.ShouldBindJSON(&payload) เพื่อดึงข้อมูลที่ส่งเข้ามาทาง JSON และเก็บไว้ในโครงสร้าง Authen
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	// ค้นหา user ด้วย Username ที่ผู้ใช้กรอกเข้ามา

	if err := config.DB().Raw("SELECT * FROM users WHERE email = ?", payload.Email).Scan(&user).Error; err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

		return

	}

	// ตรวจสอบรหัสผ่าน

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": "password is incerrect"})

		return

	}

	jwtWrapper := services.JwtWrapper{

		SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",

		Issuer: "AuthService",

		ExpirationHours: 24,
	}
//กำหนดค่าในโครงสร้าง jwtWrapper ซึ่งใช้สำหรับสร้าง JWT Token โดยมี SecretKey ที่ใช้เข้ารหัส, Issuer (ผู้ที่ออก Token), และระยะเวลาหมดอายุของ Token (24 ชั่วโมง)
	signedToken, err := jwtWrapper.GenerateToken(user.Email)

	if err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": user.ID, "resume_id": user.ResumeID})
	// ถ้า Token ถูกสร้างสำเร็จ จะส่งข้อมูลกลับไปยังผู้ใช้ โดยประกอบด้วย:
	// token_type: ชนิดของ Token คือ Bearer
	// token: JWT Token ที่สร้างขึ้น
	// id: รหัสผู้ใช้ (User ID)
	// resume_id: รหัสประจำของ resume (Resume ID)
}