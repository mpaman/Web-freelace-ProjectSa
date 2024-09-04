package entity

import (
	"gorm.io/gorm"
)

type FviewProfile struct {
	gorm.Model
	Displayname string

	FreelanceID *uint
	Freelance   Freelance `gorm:"foriegnKey:FreelanceID"`
}
