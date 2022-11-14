package routers

import (
	"fmt"
	"jwt-tutorial/utils"
	"net/http"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func hello(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Hello GO!",
	})
}

func InitRouter(api *gin.Engine) {
	api.Use(cors.New(cors.Config{
		// アクセスを許可したいアクセス元
		AllowOrigins: []string{
			"*",
		},
		// アクセスを許可したいHTTPメソッド(以下の例だとPUTやDELETEはアクセスできません)
		AllowMethods: []string{
			"POST",
			"GET",
			"PATCH",
			"DELETE",
			"OPTIONS",
		},
		// 許可したいHTTPリクエストヘッダ
		AllowHeaders: []string{
			"Access-Control-Allow-Credentials",
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"Authorization",
		},
	}))
	api.GET("/", hello)

	v1 := api.Group("api/v1")
	user_router := v1.Group("/users")
	InitUserRouter(user_router)
}

func middleware(c *gin.Context) {
	AuthorizationHeader := c.Request.Header.Get("Authorization")
	if AuthorizationHeader != "" {
		ary := strings.Split(AuthorizationHeader, " ")
		if len(ary) == 2 {
			if ary[0] == "Bearer" {
				t, err := jwt.ParseWithClaims(ary[1], &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
					return utils.SigningKey, nil
				})
				if claims, ok := t.Claims.(*jwt.MapClaims); ok && t.Valid {
					userId := (*claims)["sub"].(string)
					c.Set("user_id", userId)
				} else {
					fmt.Println(err)
				}
			}
		}
	}
	c.Next()
}
