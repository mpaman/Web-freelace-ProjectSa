package main

import (
	"net/http"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/booking"
	"example.com/sa-67-example/controller/genders"
	"example.com/sa-67-example/controller/postwork"
	submission "example.com/sa-67-example/controller/subnission"
	"example.com/sa-67-example/controller/users"
	"example.com/sa-67-example/controller/work"
	"example.com/sa-67-example/middlewares"
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
    r.POST("/submissions/:id",submission.CreateSubmission)

	// Authorized Routes
	authorized := r.Group("/")
	authorized.Use(middlewares.Authorizes())


	// User Routes
	authorized.PUT("/user/:id", users.Update)
	authorized.GET("/users", users.GetAll)
	authorized.GET("/user/:id", users.Get)
	authorized.DELETE("/user/:id", users.Delete)
	authorized.GET("/user/profile", users.GetUserProfile)  // Add this line

	// Work Routes
	authorized.POST("/work", work.Create)
	authorized.GET("/works", work.GetAll)
	authorized.GET("/work/:id", work.Get)
	authorized.PUT("/work/:id", work.Update)
	authorized.DELETE("/work/:id", work.Delete)

	// Postwork Routes
	authorized.GET("/postworks", postwork.GetAll)
	authorized.GET("/postwork/:id", postwork.Get)

	// Booking Routes
	// authorized.POST("/postwork/:id/bookings",booking.CreateBookingFromPostwork)
	authorized.POST("/booking", booking.Create)
	authorized.GET("/bookings",booking.GetAllBookings)
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
