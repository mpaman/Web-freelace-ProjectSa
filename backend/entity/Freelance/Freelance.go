package entity

import (
	"gorm.io/gorm"
)

type Freelance struct {
	gorm.Model

	// FreelanceID  int
	Username    string
	Password    string
	FirstName   string
	LastName    string
	Email       string
	PhoneNumber string

	Rating            []Rating            `gorm:"foreignKey:FreelanceID"`
	Payment           []Payment           `gorm:"foreignKey:FreelanceID"`
	Resume            []Resume            `gorm:"foreignKey:FreelanceID"`
	FviewProfile      []FviewProfile      `gorm:"foreignKey:FreelanceID"`
	FeditProfile      []FeditProfile      `gorm:"foreignKey:FreelanceID"`
	EmpaymentContract []EmpaymentContract `gorm:"foreignKey:FreelanceID"`
}
