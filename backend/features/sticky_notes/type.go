package sticky_notes

type StickyNoteData struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Color   string `json:"color"`
	Id      string `json:"id"`
}
