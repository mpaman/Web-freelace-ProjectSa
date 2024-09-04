package entity

import (
	"gorm.io/gorm"
)

type BoardPost struct {
	gorm.Model


	WorkID *uint
	Work   Work `gorm:"foriegnKey:WorkID"`

	CustomerID *uint
	Customer   Customer `gorm:"foriegnKey:CustomerID"`
}
