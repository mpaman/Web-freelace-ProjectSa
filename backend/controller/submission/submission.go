package submission

import (
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
    "net/http"
    // "os"
    // "path/filepath"
)

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
