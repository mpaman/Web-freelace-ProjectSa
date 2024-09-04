package entity

import (
	"gorm.io/gorm"
	// "time"
)

type Skill struct {
	gorm.Model
	Skill string
	Level int
	
	
	Resume []Resume `gorm:"foreignKey:SkillID"`

}
