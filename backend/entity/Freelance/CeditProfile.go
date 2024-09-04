package entity

import (
	"gorm.io/gorm"
	// "time"
)

type CeditProfile struct {
	gorm.Model
	// editUsername string
	// editDisplay string
	// editGender uint

	
	
	CustomerID *uint
	Customer   Customer `gorm:"foriegnKey:CustomerID"`

}
