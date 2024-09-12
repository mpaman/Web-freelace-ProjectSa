package booking

import (
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

// BookingPayload defines the structure for the incoming booking data
type BookingPayload struct {
	WorkID         uint   `json:"work_id"`
	BookerUserID   uint   `json:"booker_user_id"`
	PosterUserID   uint   `json:"poster_user_id"`
	Status         string `json:"status"`
}

// CreateBooking handles the creation of a new booking
func CreateBooking(c *gin.Context) {
	var payload BookingPayload

	// Bind the request JSON to BookingPayload struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create a new Booking entity
	booking := entity.Booking{
		WorkID:         payload.WorkID,
		BookerUserID:   payload.BookerUserID,
		PosterUserID:   payload.PosterUserID,
		Status:         payload.Status,
	}

	// Save the Booking entity to the database
	db := config.DB()
	if err := db.Create(&booking).Error; err != nil {
		log.Println("Error saving Booking entity:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return success response with the created booking ID
	c.JSON(http.StatusCreated, gin.H{"message": "Booking created successfully", "booking_id": booking.ID})
}
