package rating

import (

	"net/http"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

// IsRatingIDUnique checks if the generated RatingID is unique in the database
func IsRatingIDUnique(ratingID string) bool {
	db := config.DB()
	var rating entity.Rating
	result := db.Where("id = ?", ratingID).First(&rating)
	return result.RowsAffected == 0
}

// GetAll fetches all rating entities
func GetAll(c *gin.Context) {
	var ratings []entity.Rating

	db := config.DB()
	results := db.Preload("Work").Preload("BookerUser").Preload("PosterUser").Find(&ratings)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, ratings)
}

// Get fetches a specific rating entity by ID
func Get(c *gin.Context) {
	ID := c.Param("id")
	var rating entity.Rating

	db := config.DB()
	result := db.Preload("Work").Preload("BookerUser").Preload("PosterUser").First(&rating, ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, rating)
}

// Delete handles deleting a specific rating entity by ID
func Delete(c *gin.Context) {
	ID := c.Param("id")
	var rating entity.Rating

	db := config.DB()
	if err := db.Delete(&rating, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rating deleted successfully"})
}

// GetAllRating fetches all rating entities
func GetAllRating(c *gin.Context) {
	var ratings []entity.Rating
	db := config.DB()
	results := db.Find(&ratings)

	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, ratings)
}

// CreateRating creates a new rating entity
func CreateRating(c *gin.Context) {
	var rating entity.Rating

	// Binding JSON request body to the rating struct
	if err := c.ShouldBindJSON(&rating); err != nil {
		// Send response back if there's an error reading the JSON data
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create database connection
	db := config.DB()

	// Save the rating data to the database
	if err := db.Create(&rating).Error; err != nil {
		// Send response back if there's an error saving the data
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Send response back on success
	c.JSON(http.StatusCreated, rating)
}
