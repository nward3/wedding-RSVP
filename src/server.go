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
	Name string `json: "name"`
	NumGuests int `json: "numGuests"`
	IsAttending bool `json: "isAttending"`
	WeddingCode string `json: "weddingCode"`
}

const (
	MongoDBHosts = "ds119370.mlab.com:19370"
	Database = "heroku_dqrb1b90"
	AuthUserName = "admin"
	AuthPassword = "testing123"
)

func main() {
	mongoDBDialInfo := &mgo.DialInfo{
		Addrs:    []string{MongoDBHosts},
		Timeout:  60 * time.Second,
		Database: Database,
		Username: AuthUserName,
		Password: AuthPassword,
	}

	mongoSession, err := mgo.DialWithInfo(mongoDBDialInfo)
	if err != nil {
		log.Fatalf("CreateSession: %s\n", err)
	}

	db := mongoSession.DB(Database)

	r := gin.Default()

	// send index.html so that the static site can be viewed
	r.StaticFS("rsvp/", http.Dir("client"))

	r.GET("/rsvps", func(c *gin.Context) {
		var results []Rsvp

		rsvpCollection := db.C("rsvps")

		err = rsvpCollection.Find(nil).All(&results)
		
		if err != nil {
			// handle error
			log.Fatal(err)
			c.JSON(400 ,gin.H{
				"error": true,
				"message": err,
			})
		} else {
			c.JSON(200, gin.H{
				"error": false,
				"data": results,
			})
		}
	})

	r.POST("/rsvp", func(c *gin.Context) {
		var rsvp Rsvp
		c.BindJSON(&rsvp)

		fmt.Println(rsvp.Name)
		fmt.Println(rsvp.NumGuests)
		fmt.Println(rsvp.IsAttending)
		fmt.Println(rsvp.WeddingCode)

		if string(rsvp.WeddingCode) != "5683" {
			c.JSON(400, gin.H{
				"error": true,
				"message": "Invalid Wedding Code. Please try again",
			})

			return
		}

		rsvpCollection := db.C("rsvps")

		err = rsvpCollection.Insert(
			&Rsvp{
				Name: rsvp.Name,
				NumGuests: rsvp.NumGuests,
				IsAttending: rsvp.IsAttending})

		if err != nil {
			// handle error
			log.Fatal(err)
			c.JSON(400, gin.H{
				"error": true,
				"message": err,
			})
		} else {
			c.JSON(200, gin.H{
				"error": false,
				"message": "success",
			})
		}
	})

	r.Run() // listen and serve on 0.0.0.0:8080
}
