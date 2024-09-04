package entity

import (
	"gorm.io/gorm"
)

type CviewProfile struct {
	gorm.Model
	Displayname string


	CustomerID *uint
	Customer   Customer `gorm:"foriegnKey:CustomerID"`
}
