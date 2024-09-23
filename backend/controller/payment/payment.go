package payment

import (
	"fmt"
	"net/http"

	// "gorm.io/gorm"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

// GetAll fetches all payment entities
func GetAll(c *gin.Context) {
	var payment []entity.Payment

	db := config.DB()
	results := db.Preload("Work").Preload("BookerUser").Preload("PosterUser").Preload("Wages").Find(&payment)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}

// Get fetches a specific payment entity by ID
func Get(c *gin.Context) {
	ID := c.Param("id")
	var payment entity.Payment

	db := config.DB()
	result := db.Preload("Work").Preload("BookerUser").Preload("PosterUser").Preload("Wages").First(&payment, ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}



// Delete handles deleting a specific booking entity by ID
func Delete(c *gin.Context) {
	ID := c.Param("id")
	var payment entity.Payment

	db := config.DB()
	if err := db.Delete(&payment, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted successfully"})
}
func GetAllPayment(c *gin.Context) {
	var payment []entity.Payment
	db := config.DB()
	results := db.Find(&payment)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}

func CreatePayment(c *gin.Context) {
    db := config.DB()

    var payment entity.Payment
    if err := c.ShouldBindJSON(&payment); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ตรวจสอบค่าที่ได้รับ
    fmt.Println("Received payment data:", payment)
	fmt.Println("Booker User ID:", payment.BookerUserID)
	fmt.Println("Poster User ID:", payment.PosterUserID)
	fmt.Println("Work ID:", payment.WorkID)


    // บันทึกในฐานข้อมูล
    if err := db.Create(&payment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create payment"})
        return
    }
    c.JSON(http.StatusOK, payment)
}








