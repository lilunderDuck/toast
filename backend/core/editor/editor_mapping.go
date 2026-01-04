package editor

var CONTENT_TYPE_MAP = map[string]uint8{
	"doc":            0,
	"table":          1,
	"tableRow":       2, // unused
	"tableHeader":    3, // unused
	"tableCell":      4, // unused
	"paragraph":      5,
	"text":           6,
	"gallery":        7,
	"localEmbed":     8,
	"tag":            9,
	"image":          10,
	"horizontalRule": 11,
	"playlist":       12,
	"video":          13, // unused
	"orderedList":    14,
	"bulletList":     15,
	"listItem":       16,
	"":               255,
}

var CONTENT_TYPE_REMAP = map[uint8]string{
	0:   "doc",
	1:   "table",
	2:   "tableRow",    // unused
	3:   "tableHeader", // unused
	4:   "tableCell",   // unused
	5:   "paragraph",
	6:   "text",
	7:   "gallery",
	8:   "localEmbed",
	9:   "tag",
	10:  "image",
	11:  "horizontalRule",
	12:  "playlist",
	13:  "video", // unused
	14:  "orderedList",
	15:  "bulletList",
	16:  "listItem",
	255: "",
}

var MARK_TYPE_MAP = map[string]uint8{
	"italic":    0,
	"bold":      1,
	"strike":    2,
	"textStyle": 3,
}

var MARK_TYPE_REMAP = map[uint8]string{
	0: "italic",
	1: "bold",
	2: "strike",
	3: "textStyle",
}
