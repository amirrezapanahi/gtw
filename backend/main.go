package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"
	"github.com/jub0bs/fcors"
	openai "github.com/sashabaranov/go-openai"
)

const (
	reviewTemplate = `
		treat this html document as a piece of writing. 
		Imagine you are a collaborative reviewer, I want you to provide constructive 
		criticism regarding the content of this document through bullet points. Once 
		finished, output the same html i gave you prefixing it with 'html:' 
		without adding or removing anything
		, this time highlighting any html 
		elements (with the html <mark> tag) that reference any of the bullet 
		points you wrote about. Here is the HTML: 
		`
)

type ReviewRequestData struct {
	HTML string `json:"html"`
}

func reviewPrompt(content string) string {
	return reviewTemplate + "'" + content + "'"
}

func main() {
	oaClient := openai.NewClient("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")
	ctx := context.Background()

	r := gin.Default()

	// configure the CORS middleware
	cors, err := fcors.AllowAccess(
		fcors.FromAnyOrigin(),
		fcors.WithMethods(
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			"UPDATE",
		),
		fcors.WithRequestHeaders(
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
			"X-Max",
		),
		fcors.MaxAgeInSeconds(86400),
	)

	if err != nil {
		log.Fatal(err)
	}

	// apply the CORS middleware to the engine
	r.Use(adapter.Wrap(cors))

	r.POST("/review", func(c *gin.Context) {
		body, err := ioutil.ReadAll(c.Request.Body)

		var requestData ReviewRequestData
		if err := json.Unmarshal(body, &requestData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		html := requestData.HTML

		req := openai.CompletionRequest{
			Model:            openai.GPT3TextDavinci003,
			MaxTokens:        1700,
			Temperature:      1,
			TopP:             1,
			FrequencyPenalty: 0,
			PresencePenalty:  0,
			BestOf:           1,
			Prompt:           reviewPrompt(string(html)),
		}

		resp, err := oaClient.CreateCompletion(ctx, req)

		if err != nil {
			fmt.Printf("Completion error: %v\n", err)
			c.AbortWithError(404, err)
		}

		c.JSON(http.StatusOK, gin.H{
			"aiResponse": resp.Choices[0].Text,
		})
	})
	r.Run()
}
