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
		var comments []db.Comment
		err = db.Psql.Model(&post).Association("User").Find(&user)
		if err != nil {
			return
		}
		fmt.Println(user)
		posts[i].User = user[0]
		err = db.Psql.Model(&post).Association("LikeUsers").Find(&user)
		if err != nil {
			return
		}
		posts[i].LikeUsers = user
		err = db.Psql.Where("post_id = ?", post.ID).Order("created_at desc").Find(&comments).Error
		if err != nil {
			return
		}
		for j, comment := range comments {
			var comment_user db.User
			if err = db.Psql.Where("id = ?", comment.UserID).First(&comment_user).Error; err != nil {
				return
			}
			comments[j].User = comment_user
		}
		posts[i].Comments = comments
	}
	return
}

func GetPost(postId string) (post db.Post, err error) {
	err = db.Psql.First(&post, "id = ?", postId).Error
	if err != nil {
		return
	}
	var user []db.User
	var comments []db.Comment
	err = db.Psql.Model(&post).Association("User").Find(&user)
	if err != nil {
		return
	}
	post.User = user[0]
	err = db.Psql.Model(&post).Association("LikeUsers").Find(&user)
	if err != nil {
		return
	}
	post.LikeUsers = user
	err = db.Psql.Where("post_id = ?", post.ID).Order("created_at desc").Find(&comments).Error
	if err != nil {
		return
	}
	for j, comment := range comments {
		var comment_user db.User
		if err = db.Psql.Where("id = ?", comment.UserID).First(&comment_user).Error; err != nil {
			return
		}
		comments[j].User = comment_user
	}
	post.Comments = comments
	return
}

func DeletePost(postId string, userId string) (err error) {
	if err = db.Psql.Where("id = ? AND user_id = ?", postId, userId).First(&db.Post{}).Error; err != nil {
		fmt.Println(err)
		return
	}
	db.Psql.Where("post_id = ?", postId).Delete(&db.Like{})
	db.Psql.Where("post_id = ?", postId).Delete(&db.Comment{})

	err = db.Psql.Where("id = ? AND user_id = ?", postId, userId).Delete(&db.Post{}).Error
	fmt.Println(err)
	return
}

func GetPostsByUserId(userId string) (ps []db.Post, err error) {
	if err = db.Psql.First(&db.User{}, "id = ?", userId).Error; err != nil {
		return
	}
	err = db.Psql.Where("user_id = ?", userId).Order("created_at desc").Find(&ps).Error
	if err != nil {
		return
	}
	for i, post := range ps {
		var user []db.User
		var comments []db.Comment
		err = db.Psql.Model(&post).Association("User").Find(&user)
		if err != nil {
			return
		}
		ps[i].User = user[0]
		err = db.Psql.Model(&post).Association("LikeUsers").Find(&user)
		if err != nil {
			return
		}
		ps[i].LikeUsers = user
		err = db.Psql.Where("post_id = ?", post.ID).Order("created_at desc").Find(&comments).Error
		if err != nil {
			return
		}
		for j, comment := range comments {
			var comment_user db.User
			if err = db.Psql.Where("id = ?", comment.UserID).First(&comment_user).Error; err != nil {
				return
			}
			comments[j].User = comment_user
		}
		ps[i].Comments = comments
	}
	return
}

func UpdatePost(content string, songUrl string, postId string) (update_post db.Post, err error) {
	err = db.Psql.First(&update_post, "id = ?", postId).Error
	if err != nil {
		return
	}
	err = db.Psql.Model(&update_post).Updates(db.Post{Content: content, SongUrl: songUrl}).Error
	if err != nil {
		return
	}

	err = db.Psql.First(&update_post, "id = ?", postId).Error
	if err != nil {
		return
	}
	return
}
