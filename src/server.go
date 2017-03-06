package main

import (
	"fmt"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/mgo.v2"
	"log"
	"net/http"
	"time"
)

type Rsvp struct {
	NAME string `json: "name"`
}

const (
	MongoDBHosts = "ds119370.mlab.com:19370"
	AuthDatabase = "heroku_dqrb1b90"
	AuthUserName = "admin"
	AuthPassword = "testing123"
	TestDatabase = "heroku_dqrb1b90"
)

func main() {
	mongoDBDialInfo := &mgo.DialInfo{
		Addrs:    []string{MongoDBHosts},
		Timeout:  60 * time.Second,
		Database: AuthDatabase,
		Username: AuthUserName,
		Password: AuthPassword,
	}

	mongoSession, err := mgo.DialWithInfo(mongoDBDialInfo)
	if err != nil {
		log.Fatalf("CreateSession: %s\n", err)
	}

	fmt.Println(mongoSession)

	rsvpCollection := mongoSession.DB("heroku_dqrb1b90").C("rsvps")

	err = rsvpCollection.Insert(&Rsvp{"Nick"})
	if err != nil {
		log.Fatal(err)
	}

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
