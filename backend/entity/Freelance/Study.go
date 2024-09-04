package entity

import (
	"gorm.io/gorm"
)

type Study struct {
	gorm.Model
	Eduaction  string
	Institution string
	Year string

	Resume []Resume `gorm:"foreignKey:StudyID"`
}
