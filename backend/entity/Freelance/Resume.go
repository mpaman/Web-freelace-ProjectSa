package entity

import (
	"gorm.io/gorm"
	// "time"
)

type Resume struct {
	gorm.Model

	CustomerID *uint
	Customer   Customer `gorm:"foriegnKey:CustomerID"`

	ExpreienceID *uint
	Expreience   Expreience `gorm:"foriegnKey:ExpreienceID"`

	SkillID *uint
	Skill   Skill `gorm:"foriegnKey:SkillID"`

	StudyID *uint
	Study   Study `gorm:"foriegnKey:StudyID"`
}
