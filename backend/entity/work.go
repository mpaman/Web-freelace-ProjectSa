package entity

import (
	"gorm.io/gorm"
)

type Work struct {
    gorm.Model

    WorkID string `gorm: json:"work_id"`

    Info string `json:"info"`

    Wages uint `json:"wages"`

    Contact string `json:"contact"`

    Category string `json:"category"`
}