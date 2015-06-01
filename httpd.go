package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

var port = flag.Int("p", 8888, "Use -p to specify port")

func main() {
	flag.Parse()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, r.URL.Path[1:])
	})
	log.Printf("Server started: http://localhost:%d\n", *port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", *port), nil))
}
