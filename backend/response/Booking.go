package response

import "github.com/gin-gonic/gin"

func Success(c *gin.Context, code int, data interface{}) {
    c.JSON(code, gin.H{"status": "success", "data": data})
}

func Fail(c *gin.Context, code int, message string) {
    c.JSON(code, gin.H{"status": "error", "message": message})
}
