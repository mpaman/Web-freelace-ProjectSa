package config

import (
	"fmt"

	// "time"

	"example.com/sa-67-example/entity"

	"gorm.io/driver/sqlite"

	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}

func ConnectionDB() {

	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})

	if err != nil {

		panic("failed to connect database")

	}

	fmt.Println("connected database")

	db = database

}

func SetupDatabase() {

	db.AutoMigrate(

		&entity.Users{},

		&entity.Genders{},

		&entity.Work{},

		&entity.Postwork{},

		&entity.Booking{},

		&entity.Submission{},

		&entity.Profile{},

		&entity.Personal{},
		&entity.Study{},
		&entity.Experience{},
		&entity.Skill{},
		&entity.Resume{},
		&entity.Payment{},

		&entity.Rating{},
	)

}
