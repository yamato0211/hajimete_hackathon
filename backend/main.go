package main

import (
	"fmt"
	"jwt-tutorial/db"
	"jwt-tutorial/routers"
	"jwt-tutorial/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	api := gin.Default()
	utils.LoadEnv()
	db.InitDB()
	routers.InitRouter(api)

	api.Run(fmt.Sprintf(":%s", utils.ApiPort))
}
