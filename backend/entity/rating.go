package entity

import "gorm.io/gorm"

type Rating struct {
    gorm.Model

    Score        uint   `json:"score"` 
    Comment      string `json:"comment"`

    BookerUserID uint   `json:"booker_user_id"`
    BookerUser   Users  `gorm:"foreignKey:BookerUserID;references:ID"`

    PosterUserID uint   `json:"poster_user_id"`
    PosterUser   Users  `gorm:"foreignKey:PosterUserID;references:ID"`
}
