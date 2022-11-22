package routers

import (
	"jwt-tutorial/cruds"
	"jwt-tutorial/types"

	"net/http"

	"github.com/gin-gonic/gin"
)

func InitPostRouter(pr *gin.RouterGroup) {
	pr.GET("", middleware, getTimeLine)
	pr.POST("", middleware, createMyPost)
	pr.DELETE("/:post_id", deletePost)
}

func createMyPost(c *gin.Context) {
	var (
		payload types.NewPost
		userId  any
		isExist bool
	)
	if userId, isExist = c.Get("user_id"); !isExist {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "token is invalid",
		})
		return
	}

	c.Bind(&payload)
	p, err := cruds.CreatePost(payload.Content, payload.SongUrl, userId.(string))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "cannot create your post",
		})
		return
	}

	c.JSON(http.StatusOK, p)
}

func getTimeLine(c *gin.Context) {
	if _, isExist := c.Get("user_id"); !isExist {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "token is invalid",
		})
		return
	}
	p, err := cruds.GetAllPost()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "failed get all posts",
		})
	}
	c.JSON(http.StatusOK, p)
}

func deletePost(c *gin.Context) {
	var (
		userId  any
		isExist bool
	)

	if userId, isExist = c.Get("user_id"); !isExist {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "token is invalid",
		})
		return
	}

	postId := c.Param("post_id")
	err := cruds.DeletePost(postId, userId.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "OK",
	})
}
