package entity

import (
	"gorm.io/gorm"
)

type Submission struct {
	gorm.Model

	WorkID       uint   `json:"work_id"`
	Work         Work   `gorm:"foreignKey:WorkID;references:ID"`
	BookerUserID uint   `json:"booker_user_id"`
	BookerUser   Users  `gorm:"foreignKey:BookerUserID;references:ID"`
	PosterUserID uint   `json:"poster_user_id"`
	PosterUser   Users  `gorm:"foreignKey:PosterUserID;references:ID"`
	FileLink     string `json:"file_link"`
}