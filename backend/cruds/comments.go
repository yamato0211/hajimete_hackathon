package cruds

import (
	"fmt"
	"jwt-tutorial/db"

	"github.com/google/uuid"
)

func CreateComment(content string, userID string, postID string) (new_comment db.Comment, err error) {
	new_comment = db.Comment{ID: uuid.New().String(), Content: content, UserID: userID, PostID: postID}
	if err = db.Psql.Create(&new_comment).Error; err != nil {
		return
	}
	var user db.User
	if err = db.Psql.Where("id = ?", userID).First(&user).Error; err != nil {
		return
	}
	new_comment.User = user
	return new_comment, err

}

func DeleteComment(commentId string) (err error) {
	if err = db.Psql.Where("id = ?", commentId).First(&db.Comment{}).Error; err != nil {
		fmt.Println(err)
		return
	}

	err = db.Psql.Where("id = ?", commentId).Delete(&db.Comment{}).Error
	fmt.Println(err)
	return
}
