package cruds

import (
	"errors"
	"jwt-tutorial/db"
)

func GiveLike(postId string, userId string) (post db.Post, err error) {
	if err = db.Psql.Where("post_id = ? AND user_id = ?", postId, userId).First(&db.Like{}).Error; err == nil {
		err = errors.New("like is already exist")
		return
	}

	fn := db.Like{
		PostID: postId,
		UserID: userId,
	}
	if err = db.Psql.Create(fn).Error; err != nil {
		return
	}
	post, err = GetPost(postId)
	return
}

func DeleteLike(postId string, userId string) (post db.Post, err error) {
	if err = db.Psql.Where("post_id = ? AND user_id = ?", postId, userId).First(&db.Like{}).Error; err != nil {
		err = errors.New("like is not found")
		return
	}

	fn := db.Like{
		PostID: postId,
		UserID: userId,
	}
	if err = db.Psql.Delete(fn).Error; err != nil {
		return
	}
	post, err = GetPost(postId)
	return
}
