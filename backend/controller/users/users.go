package users

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/sa-67-example/config"

	"example.com/sa-67-example/entity"
)

func GetAll(c *gin.Context) {

	var users []entity.Users

	db := config.DB()

	results := db.Preload("Gender").Find(&users)

	if results.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})

		return

	}

	c.JSON(http.StatusOK, users)

}

func Get(c *gin.Context) {

	ID := c.Param("id")//ฟังก์ชันจะรับค่า ID ของผู้ใช้ที่ต้องการดึงข้อมูลจากพารามิเตอร์ URL (c.Param("id"))

	var user entity.Users

	db := config.DB()

	results := db.Preload("Gender").First(&user, ID)
//ฟังก์ชันใช้คำสั่ง db.Preload("Gender").First(&user, ID) เพื่อดึงข้อมูลผู้ใช้ตาม ID ที่ระบุ โดย Preload("Gender") ใช้เพื่อดึงข้อมูลจากตาราง Gender ที่เชื่อมโยงกับผู้ใช้ในตาราง Users
	if results.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})

		return

	}
//หาก user.ID == 0 หมายความว่าไม่มีผู้ใช้ที่ตรงกับ ID ที่ระบุในฐานข้อมูล ฟังก์ชันจะส่งสถานะ StatusNoContent (204 No Content) กลับไป ซึ่งหมายถึงไม่พบข้อมูลใด ๆ แต่ไม่มีข้อผิดพลาด
	if user.ID == 0 {

		c.JSON(http.StatusNoContent, gin.H{})

		return

	}

	c.JSON(http.StatusOK, user)

}

func Update(c *gin.Context) {

	var user entity.Users

	UserID := c.Param("id")

	db := config.DB()

	result := db.First(&user, UserID)

	if result.Error != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})

		return

	}

	if err := c.ShouldBindJSON(&user); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})

		return

	}

	result = db.Save(&user)

	if result.Error != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})

		return

	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})

}

func Delete(c *gin.Context) {
	id := c.Param("id")//ฟังก์ชันจะรับค่า id ของผู้ใช้ที่ต้องการลบจากพารามิเตอร์ URL (c.Param("id"))

	db := config.DB()

	// Start a transaction
	tx := db.Begin()
//ฟังก์ชันจะเริ่ม transaction ด้วยคำสั่ง tx := db.Begin() ซึ่งเป็นการเริ่มกระบวนการที่ทำงานหลายขั้นตอน โดยถ้าเกิดข้อผิดพลาดในขั้นตอนใด ระบบจะยกเลิกการทำงานทั้งหมด (Rollback)
	// Delete associated Postwork entries
	if err := tx.Where("iduser = ?", id).Delete(&entity.Postwork{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete associated Postwork entries"})
		return
	}
//คำสั่ง tx.Where("iduser = ?", id).Delete(&entity.Postwork{}) จะค้นหาและลบข้อมูลในตาราง Postwork ที่มี iduser ตรงกับ id ที่ส่งเข้ามา
	// Delete the User
	if err := tx.Delete(&entity.Users{}, id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete user"})
		return
	}

	// Commit the transaction
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func GetUserProfile(c *gin.Context) {
	// Extract user email from the context
	email, exists := c.Get("userEmail")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User email not found in context"})
		return
	}

	var user entity.Users
	db := config.DB()//ฟังก์ชันจะเชื่อมต่อกับฐานข้อมูลผ่านคำสั่ง config.DB() แล้วทำการค้นหาข้อมูลในตาราง Users โดยใช้เงื่อนไขค้นหาจากอีเมลของผู้ใช้ที่ดึงได้จาก context

	// Fetch user details from the database
	result := db.Preload("Gender").Where("email = ?", email).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	//ฟังก์ชันจะใช้คำสั่ง db.Preload("Gender").Where("email = ?", email).First(&user) 
	//เพื่อค้นหาข้อมูลผู้ใช้ในตาราง Users โดยใช้เงื่อนไขค้นหาจาก อีเมล ที่ดึงได้จาก context และ preload ความสัมพันธ์กับตาราง Gender เพื่อดึงข้อมูลเพศของผู้ใช้มาด้วย

	// Return user profile details
	c.JSON(http.StatusOK, gin.H{
		"ID":        user.ID,
		"Profile":   user.Profile,
		"FirstName": user.FirstName,
		"LastName":  user.LastName,
		"Role":  user.Role,
	})
}

// Mock function to extract user ID from the token
func extractUserIDFromToken(token string) (uint, error) {
	// Implement your token parsing and validation logic here
	// This is a placeholder function
	return 1, nil // Replace with actual implementation
}//เป็นฟังก์ชันใน Go ที่ใช้สำหรับการดึง UserID จาก JWT (JSON Web Token) ที่ได้รับจาก client