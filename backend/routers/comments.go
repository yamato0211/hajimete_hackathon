package routers

import (
	"jwt-tutorial/cruds"
	"jwt-tutorial/types"

	"net/http"

	"github.com/gin-gonic/gin"
)

func InitCommentRouter(pr *gin.RouterGroup) {
	//pr.GET("", middleware, getTimeLine)
	pr.POST("/:post_id", middleware, createMyComment)
	pr.DELETE("/:comment_id", middleware, deleteComment)
}

func createMyComment(c *gin.Context) {
	var (
		payload types.NewComment
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
	c.Bind(&payload)
	p, err := cruds.CreateComment(payload.Content, userId.(string), postId)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "cannot create your comment",
		})
		return
	}

	c.JSON(http.StatusOK, p)
}

func deleteComment(c *gin.Context) {
	var (
		isExist bool
	)

	if _, isExist = c.Get("user_id"); !isExist {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "token is invalid",
		})
		return
	}

	commentId := c.Param("comment_id")
	err := cruds.DeleteComment(commentId)
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
