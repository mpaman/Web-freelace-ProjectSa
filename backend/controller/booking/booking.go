package booking

import (
	"net/http"
	// "gorm.io/gorm"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"fmt"
	"github.com/gin-gonic/gin"
)
func GetBookingsByWorkID(c *gin.Context) {
    workID := c.Param("workID") // รับค่า workID จาก URL parameter

    var bookings []entity.Booking // สร้าง slice เพื่อเก็บรายการการจอง
    db := config.DB() // เชื่อมต่อกับฐานข้อมูล

    result := db.Where("work_id = ?", workID).Find(&bookings) // ค้นหาข้อมูลการจองที่มี work_id ตรงกับ workID ที่รับมา
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()}) // ถ้าพบข้อผิดพลาด ให้ส่งข้อความผิดพลาดกลับไป
        return
    }

    c.JSON(http.StatusOK, bookings) // ส่งข้อมูลการจองทั้งหมดกลับไปในรูปแบบ JSON
}


// Delete handles deleting a specific booking entity by ID
func Delete(c *gin.Context) {
	ID := c.Param("id")
	var booking entity.Booking

	db := config.DB()
	if err := db.Delete(&booking, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted successfully"})
}
func GetAllBookings(c *gin.Context) {
	var bookings []entity.Booking
	db := config.DB()
	results := db.Find(&bookings)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, bookings)
}

func CreateBookingFromPostwork(c *gin.Context) {
	var input entity.Booking
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// ตรวจสอบไม่ให้ poster_user_id และ booker_user_id ซ้ำกัน
	if input.PosterUserID == input.BookerUserID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Poster cannot book their own job"})
		return
	}
	
	var existingBooking entity.Booking
	if err := config.DB().Where("work_id = ? AND booker_user_id = ?", input.WorkID, input.BookerUserID).First(&existingBooking).Error; err == nil {
		if existingBooking.Status == "accepted" {
			// ถ้าผู้ใช้จองงานและสถานะเป็น accepted ให้ตอบกลับว่าจองสำเร็จแล้ว
			c.JSON(http.StatusOK, gin.H{"message": "Booking already accepted", "redirect": true})
			return
		} else {
			// ถ้ามีการจองที่ยังไม่ได้รับการยอมรับ
			c.JSON(http.StatusBadRequest, gin.H{"error": "This user has already booked this job"})
			return
		}
	}

	// ถ้าไม่พบ booking ที่ซ้ำกัน
	if err := config.DB().Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Booking created successfully"})
}

func UpdateBookingStatus(c *gin.Context) {
    bookingID := c.Param("id") // รับค่า id ของการจองจาก URL parameter
    var booking entity.Booking // สร้างตัวแปร booking สำหรับเก็บข้อมูลการจอง

    var input struct {
        Status string `json:"status"` // โครงสร้างข้อมูลสำหรับการรับข้อมูล JSON ที่มีฟิลด์ Status
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        fmt.Printf("Binding error: %v\n", err) // Debugging line
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Debugging line
    fmt.Printf("Received status: %s\n", input.Status)

    if err := config.DB().Where("id = ?", bookingID).First(&booking).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"}) // ถ้าหากไม่พบ booking ส่งข้อความผิดพลาดกลับไป
        return
    }

    booking.Status = input.Status // อัปเดตสถานะของการจองตามที่รับมาใน input
    if err := config.DB().Save(&booking).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking status"}) // ถ้าพบข้อผิดพลาดในการบันทึกข้อมูล ส่งข้อความผิดพลาดกลับไป
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Booking status updated successfully"}) // ส่งข้อความยืนยันว่าการอัปเดตสถานะสำเร็จ
}

