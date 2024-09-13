package main

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/booking"
	"example.com/sa-67-example/controller/genders"
	"example.com/sa-67-example/controller/postwork"
	"example.com/sa-67-example/controller/submission"
	"example.com/sa-67-example/middlewares"
	"example.com/sa-67-example/controller/users"
	"example.com/sa-67-example/controller/work"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {
    config.ConnectionDB()
    config.SetupDatabase()

    r := gin.Default()
    r.Use(CORSMiddleware())

    // Public Routes
    r.POST("/signup", users.SignUp)
    r.POST("/signin", users.SignIn)
    r.GET("/genders", genders.GetAll)
    
    r.POST("/postwork/:id/bookings", booking.CreateBookingFromPostwork)
	
    r.POST("/upload", submission.UploadFile)
    r.POST("/postwork/:id/sent", submission.CreateSubmission)

    // Authorized Routes
    authorized := r.Group("/")
	authorized.Use(middlewares.Authorizes())

    authorized.PUT("/user/:id", users.Update)
    authorized.GET("/users", users.GetAll)
    authorized.GET("/user/:id", users.Get)
    authorized.DELETE("/user/:id", users.Delete)

    authorized.GET("/user/profile", users.GetUserProfile)

    // Work Routes
    authorized.POST("/works", work.Create)
    authorized.GET("/works", work.GetAll)
    authorized.GET("/work/:id", work.Get)
    authorized.PUT("/work/:id", work.Update)
    authorized.DELETE("/work/:id", work.Delete)

    authorized.GET("/postworks", postwork.GetAll)
    authorized.GET("/postwork/:id", postwork.Get)

	authorized.GET("/works/:workID/bookings", booking.GetBookingsByWorkID)
    authorized.GET("/bookings", booking.GetAllBookings)
    authorized.GET("/booking/:id", booking.Get)
    authorized.PUT("/booking/:id", booking.Update)
    authorized.DELETE("/booking/:id", booking.Delete)

    r.GET("/", func(c *gin.Context) {
        c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
    })

    r.Run("localhost:" + PORT)
}


func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
