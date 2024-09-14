package booking

import (
	"math/rand"
	"net/http"
	"time"
	// "gorm.io/gorm"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"fmt"
	"github.com/gin-gonic/gin"
)

const letterBytes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numberBytes = "0123456789"

// GenerateRandomBookingID generates a unique BookingID with 2 random letters and 3 random digits
func GenerateRandomBookingID() string {
	rand.Seed(time.Now().UnixNano())
	b := make([]byte, 2+3)
	for i := 0; i < 2; i++ {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	for i := 2; i < 5; i++ {
		b[i] = numberBytes[rand.Intn(len(numberBytes))]
	}
	return string(b)
}

// IsBookingIDUnique checks if the generated BookingID is unique in the database
func IsBookingIDUnique(bookingID string) bool {
	db := config.DB()
	var booking entity.Booking
	result := db.Where("id = ?", bookingID).First(&booking)
	return result.RowsAffected == 0
}

// GetAll fetches all booking entities
func GetAll(c *gin.Context) {
	var bookings []entity.Booking

	db := config.DB()
	results := db.Preload("Work").Preload("BookerUser").Preload("PosterUser").Find(&bookings)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, bookings)
}

// Get fetches a specific booking entity by ID
func Get(c *gin.Context) {
	ID := c.Param("id")
	var booking entity.Booking

	db := config.DB()
	result := db.Preload("Work").Preload("BookerUser").Preload("PosterUser").First(&booking, ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, booking)
}

func GetBookingsByWorkID(c *gin.Context) {
	workID := c.Param("workID")

	var bookings []entity.Booking
	db := config.DB()

	result := db.Where("work_id = ?", workID).Find(&bookings)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, bookings)
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

// func CreateBookingFromPostwork(c *gin.Context) {
// 	var postwork entity.Postwork
// 	var booking entity.Booking
// 	var User	entity.Users
// 	postworkID := c.Param("id")

// 	// Fetch postwork details
// 	if err := config.DB().Preload("User").Preload("Work").First(&postwork, postworkID).Error; err != nil {
// 		if err == gorm.ErrRecordNotFound {
// 			c.JSON(http.StatusNotFound, gin.H{"error": "Postwork not found"})
// 			return
// 		}
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Retrieve user from context
// 	// Create Booking
// 	booking.WorkID = postwork.ID
// 	booking.PosterUserID = postwork.IDuser
// 	booking.BookerUserID = User.ID
// 	booking.Status = "pending"

// 	if err := config.DB().Create(&booking).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Booking created successfully", "booking": booking})
// }

func CreateBookingFromPostwork(c *gin.Context) {
    var input entity.Booking
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
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

    c.JSON(http.StatusOK, gin.H{"message": "Booking created successfully"})
}
func UpdateBookingStatus(c *gin.Context) {
	bookingID := c.Param("id")
	var booking entity.Booking
	var input struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Printf("Binding error: %v\n", err) // Debugging line
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Debugging line
	fmt.Printf("Received status: %s\n", input.Status)

	if err := config.DB().Where("id = ?", bookingID).First(&booking).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	booking.Status = input.Status
	if err := config.DB().Save(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update booking status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking status updated successfully"})
}


