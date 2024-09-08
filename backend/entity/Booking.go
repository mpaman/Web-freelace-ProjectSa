package entity

import (
    "gorm.io/gorm"
)

type Booking struct {
    gorm.Model
    BookingID string `gorm:"unique;not null" json:"booking_id"`
    WorkID    string `json:"work_id"`
    UserID    string `json:"user_id"`
    Details   string `json:"details"`
    Status    string `json:"status"` // e.g., "pending", "accepted", "rejected"
}
