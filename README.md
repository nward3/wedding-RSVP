# Wedding RSVP

### Overview

This project provides an interface for guests to RSVP for a wedding. The guests can get more information about the logistics of the wedding day as well as RSVP and make a song request for the reception. 


### How To Run

- After installing golang and cloning the repository, run ``` go get gopkg.in/gin-gonic/gin.v1 ``` and ``` go get gopkg.in/mgo.v2 ``` to install the 3rd party go dependencies. 

- Change to the *src* directory and run ``` go run server.go ``` to run the server

- In a browser, go to [http://localhost:8080/rsvp](http://localhost:8080/rsvp) to view the rsvp site or [http://localhost:8080/admin](http://localhost:8080/admin) to view the admin site.


### Unique Go Features

This project utilizes go routines and waitgroups to execute multiple MongoDB insertions in parallel. Without using a go routine, the go server would have to wait for the first query to finish, then start the next query and wait for it to finish, and then send the response back to the client. Utilizing go routines, the Mongo insertion of the RSVP data occurs in parallel asynchronously as the Mongo insertion of the song request executes. As soon as both queries are done, the response is sent back to the client. Using go routines in this manner to execute Mongo queries improves the response time of this HTTP request by approximately 50%. 


### Acknowledgements

- Website template: http://pavlyukpetr.com/projects/wedding/bigfoto-index.html


### Requirements
- Golang v1.8
- gopkg.in/gin-gonic/gin.v1
- gopkg.in/mgo.v2