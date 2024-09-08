package config

import (
	"fmt"

	"time"

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
	)

	GenderMale := entity.Genders{Gender: "Male"}

	GenderFemale := entity.Genders{Gender: "Female"}

	db.FirstOrCreate(&GenderMale, &entity.Genders{Gender: "Male"})

	db.FirstOrCreate(&GenderFemale, &entity.Genders{Gender: "Female"})

	hashedPassword, _ := HashPassword("123456")

	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")

	User := &entity.Users{

		FirstName: "Software",

		LastName: "Analysis",

		Email: "mpaman@gmail.com",

		Age: 80,

		Password: hashedPassword,

		BirthDay: BirthDay,

		GenderID: 1,

		Address: "b5df",

		Category: "ออกแบบ",

		Wages: 2500,

		Contact: "096-721-1316",
	}

	Work := &entity.Work{

		Info: "สวัสดีครับ",

		Wages: 25,

		Contact: "096-721-1316",

		Category: "ลอง",
	}

	db.FirstOrCreate(User, &entity.Users{

		Email: "mpaman@gmail.com",
	})

	db.FirstOrCreate(Work, &entity.Work{

		WorkID: "001",
	})

}
