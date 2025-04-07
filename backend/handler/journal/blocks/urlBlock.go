package blocks

// import (
// 	"fmt"
// 	"net/http"

// 	"github.com/PuerkitoBio/goquery"
// )

// type WebPageInformation struct {
// 	Title       string `json:"title"`
// 	Url         string `json:"url"`
// 	Description string `json:"description"`
// 	Image       string `json:"image"`
// 	ThemeColor  string `json:"themeColor"`
// }

// func Link_GetPageInformation(url string) (*WebPageInformation, error) {
// 	fmt.Printf("GET %s", url)
// 	response, err := http.Get(url)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer response.Body.Close()
// 	if response.StatusCode != 200 {
// 		return nil, fmt.Errorf("idk if this is an error code or not but... you have been hit with an: %d", response.StatusCode)
// 	}

// 	// Load the HTML document
// 	doc, err := goquery.NewDocumentFromReader(response.Body)
// 	if err != nil {
// 		return nil, err
// 	}

// 	// Find the review items
// 	var pageInfo WebPageInformation
// 	doc.Find("meta").Each(func(index int, selection *goquery.Selection) {
// 		description, _ := doc.Find("meta[name='description']").Attr("content")
// 		title, _ := doc.Find("title").Attr("content")
// 		image, _ := doc.Find("meta[name='image']").Attr("content")
// 		themeColor, _ := doc.Find("meta[name='theme-color']").Attr("content")

// 		pageInfo = WebPageInformation{
// 			Title:       title,
// 			Url:         url,
// 			Description: description,
// 			Image:       image,
// 			ThemeColor:  themeColor,
// 		}
// 	})

// 	return &pageInfo, nil
// }
