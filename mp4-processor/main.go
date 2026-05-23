package main

import (
	"encoding/json"
	"log"
	"mp4-processor/processor"
	"strings"

	"github.com/nats-io/nats.go"
)


type NatsWrapper struct {
	Pattern string          `json:"pattern"`
	Data    IncomingMessage `json:"data"`
}

type IncomingMessage struct {
	ID   string `json:"id"`
	Path string `json:"path"`
}

type ResultMessage struct {
	ID         string `json:"id"`
	Status     string `json:"status"`
	Error      string `json:"error"`
	OutputPath string `json:"output_path"`
}

func main() {
	nc, err := nats.Connect("nats://nats_service:4222")
	if err != nil {
		log.Fatal("Error connecting to NATS: ", err)
	}
	defer nc.Close()

	log.Println("Processor service started, waiting for messages...")

	nc.Subscribe("file.process", func(msg *nats.Msg) {
		var wrapper NatsWrapper
		if err := json.Unmarshal(msg.Data, &wrapper); err != nil {
			log.Println("Failed to parse message:", err)
			return
		}
		incoming := wrapper.Data
		log.Printf("Processing file ID %s: %s\n", incoming.ID, incoming.Path)

		outputPath := strings.TrimSuffix(incoming.Path, ".mp4") + "_init.mp4"

		result := ResultMessage{ID: incoming.ID}

		err := processor.Processor(incoming.Path, outputPath)
		if err != nil {
			result.Status = "failed"
			result.Error = err.Error()
		} else {
			result.Status = "successful"
			result.OutputPath = outputPath 
		}

		resultBytes, _ := json.Marshal(result)
		nc.Publish("file.result", resultBytes)

		log.Printf("Done processing file ID %s, status: %s\n", incoming.ID, result.Status)
	})

	select {}
}