package profile

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func Create(c *gin.Context) {
	var profile entity.Profile

	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()
	if err := db.Create(&profile).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Profile created successfully", "profile": profile})
}

func GetAll(c *gin.Context) {
	var profiles []entity.Profile

	db := config.DB()

	// Use Preload to fetch associated Users and Work entities
	results := db.Preload("User").Preload("Work").Find(&profiles)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, profiles)
}

func Get(c *gin.Context) {
	ID := c.Param("id")
	var profile entity.Profile

	// Get a reference to the database
	db := config.DB()

	// Fetch the Profile record by ID with preloaded User and Work entities
	result := db.Preload("User").Preload("Work").First(&profile, ID)

	// Handle errors if the record is not found
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	// Return the Profile record as JSON
	c.JSON(http.StatusOK, profile)
}

func Delete(c *gin.Context) {
	ID := c.Param("id")

	db := config.DB()
	// Start a transaction to ensure atomicity
	tx := db.Begin()

	// Delete the Profile entry
	if err := tx.Delete(&entity.Profile{}, ID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Failed to delete Profile entry"})
		return
	}

	// Commit the transaction
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "Profile deleted successfully"})
}