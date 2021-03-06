package main

import (
	"fmt"
	"gopkg.in/gin-gonic/gin.v1"
	"gopkg.in/mgo.v2"
	"log"
	"net/http"
	"time"
	"sync"
)

type Rsvp struct {
	Name string `json: "name"`
	NumGuests int `json: "numGuests"`
	IsAttending bool `json: "isAttending"`
	WeddingCode string `json: "weddingCode"`
	RequestedSongs string `json: "requestedSongs"`
}

type RequestedSong struct {
	Song string `json: "song"`
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

	r.StaticFS("admin/", http.Dir("admin"))

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
				"responses": results,
			})
		}
	})

	r.GET("/songs", func(c *gin.Context) {
		var results []RequestedSong

		songCollection := db.C("requested_songs")

		err = songCollection.Find(nil).All(&results)
		
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
				"responses": results,
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
		fmt.Println(rsvp.RequestedSongs)

		if rsvp.Name == "" {
			c.JSON(400, gin.H{
				"error": true,
				"message": "Please provide your name",
			})

			return
		} else if rsvp.NumGuests == 0 || string(rsvp.NumGuests) == "" {
			c.JSON(400, gin.H{
				"error": true,
				"message": "Please specify the number of guests",
			})

			return
		}

		if string(rsvp.WeddingCode) != "5683" {
			c.JSON(400, gin.H{
				"error": true,
				"message": "Invalid Wedding Code. Please try again",
			})

			return
		}

		rsvpCollection := db.C("rsvps")
		requestedSongsCollection := db.C("requested_songs")

		var waitGroup sync.WaitGroup

		waitGroup.Add(2)

		go addRsvp(rsvpCollection, &rsvp, &waitGroup)
		go addRequestedSong(requestedSongsCollection, rsvp.RequestedSongs, &waitGroup)

		// wait for all queries to finish
		waitGroup.Wait()

		c.JSON(200, gin.H{
			"error": false,
			"message": "We'll see you on the big night!",
		})
	})

	r.Run(":8080") // listen and serve on 0.0.0.0:8080
}

func addRequestedSong(requestedSongsCollection *mgo.Collection, songTitle string, wg *sync.WaitGroup) {
	requestedSongsCollection.Insert(
		&RequestedSong{
			Song: songTitle})

	wg.Done()
}

func addRsvp(rsvpCollection *mgo.Collection, rsvp *Rsvp, wg *sync.WaitGroup) {
	rsvpCollection.Insert(
		&Rsvp{
			Name: rsvp.Name,
			NumGuests: rsvp.NumGuests,
			IsAttending: rsvp.IsAttending})

	wg.Done()
}
