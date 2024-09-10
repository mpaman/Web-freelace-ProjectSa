package entity

import (
    "gorm.io/gorm"
)

type Booking struct {
    gorm.Model

    WorkID       uint      `json:"work_id"`
    Work         Work      `gorm:"foreignKey:WorkID;references:ID"`

    BookerUsers   []Users   `gorm:"many2many:booking_users;joinForeignKey:BookingID;joinReferences:UserID"`
    PosterUserID  uint     `json:"poster_user_id"`
    PosterUser    Users     `gorm:"foreignKey:PosterUserID;references:ID"`

    Status        string   `json:"status"` // เช่น "pending", "accepted", "rejected"
}