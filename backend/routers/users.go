package routers

import (
	"jwt-tutorial/cruds"
	"jwt-tutorial/db"
	"jwt-tutorial/types"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitUserRouter(ur *gin.RouterGroup) {
	ur.POST("/signup", signUp)
	ur.POST("/signin", signIn)
	ur.GET("/@me", middleware, getMe)
	ur.GET("/:user_id", middleware, getUser)
	ur.PATCH("/@me", middleware, updateName)
}

func signUp(c *gin.Context) {
	var payload types.SignUpUser
	c.Bind(&payload)

	u, err := cruds.CreateUser(payload.Name, payload.Email, payload.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, &u)
}

func signIn(c *gin.Context) {
	var payload types.SignInUser
	c.Bind(&payload)
	u, err := cruds.GenerateJWT(payload.Email, payload.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})

		return
	}
	c.JSON(http.StatusOK, &u)
}

func getMe(c *gin.Context) {
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

	userInfo := &db.User{}
	if err := cruds.GetUserByID(userInfo, userId.(string)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "user is not exist",
		})

		return
	}

	c.JSON(http.StatusOK, userInfo)
	//return
}

func getUser(c *gin.Context) {
	userId := c.Param("user_id")
	userInfo := &db.User{}
	if err := cruds.GetUserByID(userInfo, userId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "user is not exist",
		})
		return
	}
	c.JSON(http.StatusOK, userInfo)
	//return
}

func updateName(c *gin.Context) {
	var (
		userId  any
		isExist bool
		user    db.User
		err     error
	)

	if userId, isExist = c.Get("user_id"); !isExist {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "token is invalid",
		})
		return
	}
	name := c.Query("name")
	if user, err = cruds.UpdateName(userId.(string), name); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, user)
}
