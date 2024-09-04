package entity

import (
	"gorm.io/gorm"
	"time"
)

type Payment struct {
	gorm.Model
	Date    time.Time
	Comment string
	Price   uint

	FreelanceID *uint
	Freelance   Freelance `gorm:"foriegnKey:FreelanceID"`

	CustomerID *uint
	Customer   Customer `gorm:"foriegnKey:CustomerID"`
}
