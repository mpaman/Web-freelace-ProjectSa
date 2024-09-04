package entity

import (
	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model

	// CustomerID  int
	Username    string
	Password    string
	FirstName   string
	LastName    string
	Email       string
	PhoneNumber string

	CviewProfile     []CviewProfile     `gorm:"foreignKey:CustomerID"`
	CeditProfile     []CeditProfile     `gorm:"foreignKey:CustomerID"`
	BoardPost         []BoardPost         `gorm:"foreignKey:CustomerID"`
	Rating            []Rating            `gorm:"foreignKey:CustomerID"`
	Payment           []Payment           `gorm:"foreignKey:CustomerID"`
	EmpaymentContract []EmpaymentContract `gorm:"foreignKey:CustomerID"`
}
