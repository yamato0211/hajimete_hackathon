package routers

import (
	"net/http"
	"jwt-tutorial/cruds"

	"github.com/gin-gonic/gin"
)

func initLikeRouter(lr *gin.RouterGroup) {
	lr.Use(middleware)
	lr.POST("/:post_id", itIsLike)
	lr.DELETE("/:post_id", itIsNotLike)
}

func itIsLike(c *gin.Context) {
	var (
		userId  any
		isExist bool
	)

	postId := c.Param("post_id")

	if userId, isExist = c.Get("user_id"); !isExist {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "token is invalid",
		})
		return
	}

	post, err := cruds.GiveLike(postId, userId.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, post)
}

func itIsNotLike(c *gin.Context) {
	var (
		userId  any
		isExist bool
	)

	postId := c.Param("post_id")

	if userId, isExist = c.Get("user_id"); !isExist {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "token is invalid",
		})
		return
	}

	post, err := cruds.DeleteLike(postId, userId.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, post)
}