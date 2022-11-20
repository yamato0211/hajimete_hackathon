package cruds

import (
	"fmt"
	"jwt-tutorial/db"
)

func CreatePost(content string, songUrl string, userID string) (new_post db.Post, err error) {
	new_post = db.Post{Content: content, SongUrl: songUrl, UserID: userID}
	if err = db.Psql.Create(&new_post).Error; err != nil {
		return
	}
	var user []db.User
	if err = db.Psql.Model(&new_post).Association("User").Find(&user); err != nil {
		return
	}
	new_post.User = user[0]
	return new_post, nil
}

func GetAllPost() (posts []db.Post, err error) {
	err = db.Psql.Model(&db.Post{}).Order("created_at desc").Find(&posts).Error
	if err != nil {
		return
	}
	for i, post := range posts {
		var user []db.User
		err = db.Psql.Model(&post).Association("User").Find(&user)
		fmt.Println(user)
		posts[i].User = user[0]
	}
	return
}
