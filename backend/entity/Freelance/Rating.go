package entity

import (
	"gorm.io/gorm"
)

type Rating struct {
	gorm.Model
	Rating  string
	Comment string

	FreelanceID *uint
	Freelance   Freelance `gorm:"foriegnKey:FreelanceID"`

	CustomerID *uint
	Customer   Customer `gorm:"foriegnKey:CustomerID"`
}
