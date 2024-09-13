package submission

import (
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
	// "gorm.io/gorm"
	"net/http"
    "fmt"
)

func UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not uploaded"})
		return
	}

	// Save the file to a directory (e.g., ./uploads)
	filePath := "./uploads/" + file.Filename
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Return the file URL
	c.JSON(http.StatusOK, gin.H{
		"file_url": filePath,
	})
}

func CreateSubmission(c *gin.Context) {
    var submission entity.Submission
    if err := c.ShouldBindJSON(&submission); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Debug: พิมพ์ค่า submission ที่รับเข้ามา
    fmt.Println("Received Submission:", submission)

    // ทำการบันทึก submission ลงในฐานข้อมูล
    if err := config.DB().Create(&submission).Error; err != nil {
        fmt.Println("Error saving submission:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create submission"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Submission created successfully"})
}

