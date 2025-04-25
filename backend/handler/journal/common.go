package journal

// Represents the type of a journal entry.
type JournalType uint8

const (
	// A regular journal.
	TYPE_JOURNAL JournalType = 0
	// A category entry, think of it as a folder.
	TYPE_CATEGORY JournalType = 1
)
