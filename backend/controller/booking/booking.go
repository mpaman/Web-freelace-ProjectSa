package booking

import (
    "math/rand"
    "net/http"
    "time"
	// "gorm.io/gorm"
    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
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

// Create handles the creation of a new booking entity
func Update(c *gin.Context) {
	ID := c.Param("id")
	var existingBooking entity.Booking

	db := config.DB()
	if err := db.First(&existingBooking, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	var updatedBooking entity.Booking
	if err := c.ShouldBindJSON(&updatedBooking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update only the fields that are provided in the request
	db.Model(&existingBooking).Updates(updatedBooking)

	c.JSON(http.StatusOK, gin.H{"message": "Booking updated successfully", "data": existingBooking})
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
    var booking entity.Booking
    if err := c.ShouldBindJSON(&booking); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Save the submission to the database
    if err := config.DB().Create(&booking).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create submission"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Submission created successfully"})
}