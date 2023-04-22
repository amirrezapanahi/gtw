package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	adapter "github.com/gwatts/gin-adapter"
	"github.com/jub0bs/fcors"
	openai "github.com/sashabaranov/go-openai"
)

const (
	reviewTemplate = `
		treat this html extract as a piece of writing. 
		Imagine you are a collaborative reviewer, I want you to provide constructive 
		criticism regarding the content of this extract through bullet points. Once 
		finished, output the bullet points as well as the same html i gave you. Making sure
		that you don't add or remove any content from the html (do NOT insert the bullet points within the html!). With the html output I want 
		you to modify the existing input html elements that are related to the respective bullet point you wrote about
		in the following format (<mark title={BULLET_POINT}>{ORIGINAL_EXTRACT}</mark>). 		
		Finally, Output your response in the following format with no exceptions:
		<BULLET_POINTS> '@' <OUTPUT_HTML>
		Where <BULLET_POINTS> is a placeholder for the bullet points you write and <OUTPUT_HTML> is the html you return back to me: 
		
		Here is the input HTML extract: 
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

type KeyRequestData struct {
	Key string `json:"key"`
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
		the document structure. Do not forget to seperate the html output with 'Generated Document Structure' with the delimiter (@)
	`, topic)

	return emptyStructureTemplate
}

func main() {
	port := os.Getenv("PORT")
	defaultPort := "8080"
	// var key = os.Getenv("KEY")
	// oaClient := openai.NewClient("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")
	var ctx = context.Background()

	r := gin.Default()

	r.Use(static.Serve("/", static.LocalFile("./build", true)))

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

	r.POST("/api/key", func(c *gin.Context) {
		//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
		body, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var requestData KeyRequestData
		if err := json.Unmarshal(body, &requestData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		key := requestData.Key

		os.Setenv("KEY", key)

		println(os.Getenv("KEY"))
		c.AbortWithStatusJSON(http.StatusOK, requestData)
	})

	r.POST("/api/custom", func(c *gin.Context) {
		body, err := ioutil.ReadAll(c.Request.Body)
		var requestData CustomRequestData
		if err := json.Unmarshal(body, &requestData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		prompt := requestData.Prompt
		println(prompt)
		oaClient := openai.NewClient(os.Getenv("KEY"))
		resp, err := oaClient.CreateChatCompletion(
			context.Background(),
			openai.ChatCompletionRequest{
				Model: openai.GPT3Dot5Turbo,
				Messages: []openai.ChatCompletionMessage{
					{
						Role:    openai.ChatMessageRoleUser,
						Content: prompt,
					},
				},
			},
		)

		if err != nil {
			fmt.Printf("Completion error: %v\n", err)
			c.AbortWithError(404, err)
		}

		c.JSON(http.StatusOK, gin.H{
			"aiResponse": resp.Choices[0].Message.Content,
		})
	})

	r.POST("/api/structure", func(c *gin.Context) {
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
			Temperature:      0.1,
			TopP:             1,
			FrequencyPenalty: 0,
			PresencePenalty:  0,
			BestOf:           1,
			Prompt:           structurePrompt(string(topic)),
		}

		oaClient := openai.NewClient(os.Getenv("KEY"))
		resp, err := oaClient.CreateCompletion(ctx, req)

		if err != nil {
			fmt.Printf("Completion error: %v\n", err)
			c.AbortWithError(404, err)
		}

		c.JSON(http.StatusOK, gin.H{
			"aiResponse": resp.Choices[0].Text,
		})
	})

	r.POST("/api/review", func(c *gin.Context) {
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
			Temperature:      0.1,
			TopP:             1,
			FrequencyPenalty: 0,
			PresencePenalty:  0,
			BestOf:           1,
			Prompt:           reviewPrompt(string(html)),
		}

		oaClient := openai.NewClient(os.Getenv("KEY"))
		resp, err := oaClient.CreateCompletion(ctx, req)

		if err != nil {
			fmt.Printf("Completion error: %v\n", err)
			c.AbortWithError(404, err)
		}

		c.JSON(http.StatusOK, gin.H{
			"aiResponse": resp.Choices[0].Text,
		})
	})

	// r.Run(":")
	if !(port == "") {
		log.Fatal(r.Run(":" + port))
	} else {
		log.Fatal(r.Run(":" + defaultPort))
	}
}
