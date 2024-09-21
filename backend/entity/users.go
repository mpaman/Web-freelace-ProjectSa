package entity

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	gorm.Model

	FirstName string `json:"first_name"`

	LastName string `json:"last_name"`

	Email string `json:"email"`

	Age uint8 `json:"age"`

	Password string `json:"-"`

	BirthDay time.Time `json:"birthday"`

	GenderID uint `json:"gender_id"`

	Gender *Genders `gorm:"foreignKey: gender_id" json:"gender"`

	RoleID uint     `json:"role_id"`
    Role   *Roles   `gorm:"foreignKey:role_id" json:"role"`

	Category string `json: "category"`

	Wages uint `json: "wages"`

	Contact string `json: "contact"`

	Profile string `gorm:"type:longtext"`

	ResumeID uint   `json:"resume_id"`
	Resume   Resume `gorm:"foreignKey:ResumeID;references:ID" json:"resume"`
}
