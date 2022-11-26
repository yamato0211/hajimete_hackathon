package cruds

import (
	"fmt"
	"jwt-tutorial/db"
)

func CreateComment(content string, userID string, postID string) (new_comment db.Comment, err error) {
	new_comment = db.Comment{Content: content, UserID: userID, PostID: postID}
	if err = db.Psql.Create(&new_comment).Error; err != nil {
		return
	}
	var user []db.User
	if err = db.Psql.Model(&new_comment).Association("User").Find(&user); err != nil {
		return
	}
	new_comment.User = user[0]
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
