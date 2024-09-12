package submission

import (
    "net/http"
    "path/filepath"
    "strconv"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
)

func UploadFile(c *gin.Context) {
    file, _ := c.FormFile("file")
    if file == nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No file is selected"})
        return
    }

    // Generate a unique filename
    filename := uuid.New().String() + filepath.Ext(file.Filename)
    filePath := filepath.Join("uploads", filename)

    // Save the file to the specified path
    if err := c.SaveUploadedFile(file, filePath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
        return
    }

    // Generate file URL (assuming you have a file server)
    fileURL := "http://yourdomain.com/" + filePath

    c.JSON(http.StatusOK, gin.H{"file_url": fileURL})
}

func CreateSubmission(c *gin.Context) {
    var submission entity.Submission
    postworkID, err := strconv.Atoi(c.Param("postwork_id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid postwork ID"})
        return
    }

    // Get file URL from request body
    var requestBody struct {
        FileLink string `json:"file_link"`
    }
    if err := c.ShouldBindJSON(&requestBody); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    // Set fields for Submission
    submission.WorkID = uint(postworkID)
    submission.BookerUserID = 1 // Replace with dynamic value based on logged-in user
    submission.PosterUserID = 2 // Replace with dynamic value based on postwork
    submission.FileLink = requestBody.FileLink

    // Save the submission to the database
    if err := config.DB().Create(&submission).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create submission"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Submission created successfully"})
}
