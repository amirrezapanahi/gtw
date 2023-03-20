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
		finished, output the bullet points as well as the same html i gave you. Making sure
		that you don't add or remove any content from the html. With the html output I want 
		you to highlight the input html elements (with the html <mark> tag) that are related to the respective 
		bullet points you wrote about but dont insert bullet point content within the html. 		
		Finally, Output your reponse in the following format: 
		
		<BULLET_POINTS> '@' <OUTPUT_HTML>
	
		Here is the HTML: 
		`
)

type ReviewRequestData struct {
	HTML string `json:"html"`
}

type StructureRequestData struct {
	Topic string `json:"topic"`
}

type CustomRequestData struct {
	Prompt string `json:"prompt"`
}

func reviewPrompt(content string) string {
	return reviewTemplate + "'" + content + "'"
}

func structurePrompt(topic string) string {

	var emptyStructureTemplate = fmt.Sprintf(`
		Generate a document structure with multiple primary headers whom each have a 
		number of secondary headers on the topic of '%s' where primary 
		headers are represented by a <h1> HTML tag and secondary headers are 
		represented by <h4> HTML tags. all <h4> tags are underlined with <u> tag. At the end 
		write a message saying 'Generated Document Structure' but use this delimiter '@' to seperate the contents from 
		the document structure
	`, topic)

	return emptyStructureTemplate
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

	r.POST("/custom", func(c *gin.Context) {
		body, err := ioutil.ReadAll(c.Request.Body)
		var requestData CustomRequestData
		if err := json.Unmarshal(body, &requestData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		prompt := requestData.Prompt
		println(prompt)

		req := openai.CompletionRequest{
			Model:            openai.GPT3TextDavinci003,
			MaxTokens:        250,
			Temperature:      1,
			TopP:             1,
			FrequencyPenalty: 0,
			PresencePenalty:  0,
			BestOf:           1,
			Prompt:           string(prompt),
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

	r.POST("/structure", func(c *gin.Context) {
		body, err := ioutil.ReadAll(c.Request.Body)
		var requestData StructureRequestData
		if err := json.Unmarshal(body, &requestData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		topic := requestData.Topic

		req := openai.CompletionRequest{
			Model:            openai.GPT3TextDavinci003,
			MaxTokens:        500,
			Temperature:      1,
			TopP:             1,
			FrequencyPenalty: 0,
			PresencePenalty:  0,
			BestOf:           1,
			Prompt:           structurePrompt(string(topic)),
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
