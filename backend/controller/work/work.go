package work

import (
    "math/rand"
    "net/http"
    "time"
    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
)

const letterBytes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numberBytes = "0123456789"

// GenerateRandomWorkID generates a unique WorkID with 2 random letters and 3 random digits
func GenerateRandomWorkID() string {
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

// IsWorkIDUnique checks if the generated WorkID is unique in the database
// func IsWorkIDUnique(WorkID string) bool {
//     db := config.DB()
//     var work entity.Work
//     result := db.Where("work_id = ?", WorkID).First(&work)
//     return result.RowsAffected == 0 // returns true if no records are found
// }

// GetAll fetches all work entities
func GetAll(c *gin.Context) {
    var works []entity.Work

    db := config.DB()
    results := db.Find(&works)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, works)
}

// Get fetches a specific work entity by ID
func Get(c *gin.Context) {
    ID := c.Param("id")
    var work entity.Work

    db := config.DB()
    results := db.First(&work, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, work)
}

// Create handles the creation of a new work entity
// Create handles the creation of a new work entity
func Create(c *gin.Context) {
    var work entity.Work

    // Generate a WorkID (can be random or fixed for non-unique cases)
    work.WorkID = GenerateRandomWorkID() // You can decide to keep this random or set it to a fixed value

    // Bind the JSON payload to the Work struct
    if err := c.ShouldBindJSON(&work); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // Save the new Work to the database
    if err := db.Create(&work).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Check if work.ID is set after creating the work
    if work.ID == 0 {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create work, ID not set"})
        return
    }

    // Retrieve the email from the context
    email, exists := c.Get("userEmail")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    // Find the user ID by email
    var user entity.Users
    result := db.Where("email = ?", email).First(&user)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user"})
        return
    }

    // Create a new Postwork entry
    var postwork entity.Postwork
    postwork.IDuser = user.ID
    postwork.IDwork = work.ID

    if err := db.Create(&postwork).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Postwork"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Work created successfully", "work": work, "postwork": postwork})
}

// Update handles updating a specific work entity by ID
func Update(c *gin.Context) {
    ID := c.Param("id")
    var existingWork entity.Work

    db := config.DB()
    if err := db.First(&existingWork, ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    var updatedWork entity.Work
    if err := c.ShouldBindJSON(&updatedWork); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    // Update only the fields that are provided in the request
    db.Model(&existingWork).Updates(updatedWork)

    c.JSON(http.StatusOK, gin.H{"message": "Work updated successfully", "data": existingWork})
}

// Delete handles deleting a specific work entity by ID
func Delete(c *gin.Context) {
    ID := c.Param("id") // รับค่า ID ของ work ที่ต้องการลบ

    db := config.DB()

    // Start a transaction
    tx := db.Begin()

    // ลบ Booking ที่เชื่อมกับ Work ผ่าน work_id
    if err := tx.Where("work_id = ?", ID).Delete(&entity.Booking{}).Error; err != nil {
        tx.Rollback() // Rollback เมื่อเกิดข้อผิดพลาด
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete associated Booking entries"})
        return
    }

    // ลบ Submission ที่เชื่อมกับ Work ผ่าน work_id
    if err := tx.Where("work_id = ?", ID).Delete(&entity.Submission{}).Error; err != nil {
        tx.Rollback() // Rollback เมื่อเกิดข้อผิดพลาด
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete associated Submission entries"})
        return
    }

    // ลบ Postwork ที่เชื่อมกับ Work ผ่าน idwork (เหมือนเดิม)
    if err := tx.Where("idwork = ?", ID).Delete(&entity.Postwork{}).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete associated Postwork entries"})
        return
    }

    // ลบ Work
    if err := tx.Delete(&entity.Work{}, ID).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusNotFound, gin.H{"error": "Failed to delete work"})
        return
    }

    // Commit transaction ถ้าการลบสำเร็จ
    tx.Commit()

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
// GetWagesByWorkID handles the request to get wages by work ID
func GetWagesByWorkID(c *gin.Context) {
    ID := c.Param("workID") // รับ workID จากพารามิเตอร์

    var work entity.Work

    db := config.DB()
    // ค้นหา work โดยใช้ workID
    if err := db.Where("id = ?", ID).First(&work).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Work not found"})
        return
    }

    // ส่งค่าจ้างกลับไป
    c.JSON(http.StatusOK, gin.H{"wages": work.Wages})
}