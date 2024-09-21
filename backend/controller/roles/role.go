package roles

import (
	"net/http"

	"example.com/sa-67-example/config"

	"example.com/sa-67-example/entity"

	"github.com/gin-gonic/gin"
)

func GetAll(c *gin.Context) {

	db := config.DB()

	var  roles[]entity.Roles

	db.Find(&roles)

	c.JSON(http.StatusOK, &roles)

}
