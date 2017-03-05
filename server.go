package main

import (
	"fmt"
	"gopkg.in/gin-gonic/gin.v1"
	"net/http"
)

type Rsvp struct {
	NAME string `json: "name"`
}

func main() {
	r := gin.Default()

	// send index.html so that the static site can be viewed
	r.StaticFS("/", http.Dir("client"))

	/* r.GET("/ring", func(c *gin.Context) { */
	/* 	c.JSON(200, gin.H{ */
	/* 		"message": "pong", */
	/* 	}) */
	/* }) */

	r.POST("/rsvp", func(c *gin.Context) {
		var rsvp Rsvp
		c.BindJSON(&rsvp)
		fmt.Println(rsvp.NAME)
		c.JSON(200, gin.H{
			"message": "success",
		})
	})

	r.Run() // listen and serve on 0.0.0.0:8080
}
