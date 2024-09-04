package entity

import (
	"gorm.io/gorm"
	// "time"
)

type FeditProfile struct {
	gorm.Model
	// editUsername string
	// editDisplay string
	// editGender uint

	
	
	FreelanceID *uint
	Freelance   Freelance `gorm:"foriegnKey:FreelanceID"`

}
