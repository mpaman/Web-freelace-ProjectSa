package submission

import (
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
    "net/http"
    "os"
    "path/filepath"
)

// Handle file upload
func UploadFile(c *gin.Context) {
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File not uploaded"})
        return
    }

    uploadDir := "./uploads/"
    filePath := filepath.Join(uploadDir, file.Filename)

    if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
        return
    }

    if err := c.SaveUploadedFile(file, filePath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "fileLink": file.Filename, // Send filename to the frontend
    })
}

// Handle file download
func DownloadFile(c *gin.Context) {
    fileName := c.Param("filename")
    filePath := filepath.Join("./uploads/", fileName)

    if _, err := os.Stat(filePath); os.IsNotExist(err) {
        c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
        return
    }

    c.File(filePath)
}

func CreateSubmission(c *gin.Context) {
    var submission entity.Submission
    if err := c.ShouldBindJSON(&submission); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Save the submission to the database
    if err := config.DB().Create(&submission).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create submission"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Submission created successfully"})
}

func GetSubmissions(c *gin.Context) {
    var submissions []entity.Submission
    if err := config.DB().Find(&submissions).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch submissions"})
        return
    }

    c.JSON(http.StatusOK, submissions)
}

func GetSubmissionsByWorkID(c *gin.Context) {
    // Receive workID from URL params
    workID := c.Param("workID")

    // Create a variable to store the submissions
    var submissions []entity.Submission

    // Find submissions that match the workID
    err := config.DB().Where("work_id = ?", workID).Find(&submissions).Error
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch submissions"})
        return
    }

    // Send submissions back to client
    c.JSON(http.StatusOK, submissions)
}
