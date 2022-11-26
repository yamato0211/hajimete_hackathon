package db

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (base *Base) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New().String()
	return
}

type Base struct {
	ID        string    `gorm:"primaryKey" json:"id" sql:"type:uuid;primary_key;default:uuid_generate_v4()"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type User struct {
	Base
	Name         string `json:"name"`
	Email        string `json:"email"`
	PasswordHash string `json:"-"`
}

type Post struct {
	Base
	UserID    string    `json:"-"`
	Content   string    `json:"content"`
	SongUrl   string    `json:"song_url"`
	User      User      `gorm:"foreignKey:UserID;reference:ID" json:"user"`
	LikeUsers []User    `gorm:"many2many:likes;" json:"like_users"`
	Comments  []Comment `gorm:"many2many:comments;" json:"comments"`
}

type Like struct {
	UserID string `gorm:"primaryKey" json:"user_id"`
	PostID string `gorm:"primaryKey" json:"post_id"`
}

type Comment struct {
	ID        string    `gorm:"not null;unique" json:"id"`
	UserID    string    `gorm:"primaryKey" json:"user_id"`
	PostID    string    `gorm:"primaryKey" json:"post_id"`
	User      User      `gorm:"foreignKey:UserID;reference:ID" json:"user"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Content   string    `json:"content"`
}
