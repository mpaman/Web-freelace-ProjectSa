package entity

import (
	"gorm.io/gorm"
)

type Work struct {
	gorm.Model

	Info     string
	Wages    string
	Contract string
	Catagory string

	BoardPost []BoardPost `gorm:"foreignKey:WorkID"`

	EmpaymentContract []EmpaymentContract `gorm:"foreignKey:WorkID"`
}
