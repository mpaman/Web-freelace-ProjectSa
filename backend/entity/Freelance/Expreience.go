package entity

import (
	"gorm.io/gorm"
)

type Expreience struct {
	gorm.Model
	JobTitle   string
	Company    string
	TimePeriod string

	Resume []Resume `gorm:"foreignKey:ExpreienceID"`
}
