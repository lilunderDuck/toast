package sticky_notes

import (
	"toast/backend/debug"
	"toast/backend/utils"
)

func (notes *Exports) StickyNotes__update(newData []StickyNoteData) error {
	if debug.DEBUG_MODE {
		debug.InfoLabel("sticky-notes", "updating data...")
	}
	return utils.WriteJsonFile(stickyNotesDbPath, newData)
}

func (notes *Exports) StickyNotes__getAll() []StickyNoteData {
	if debug.DEBUG_MODE {
		debug.InfoLabel("sticky-notes", "get all data...")
	}

	data, err := utils.ReadJsonFile[[]StickyNoteData](stickyNotesDbPath)
	if err != nil {
		if debug.DEBUG_MODE {
			debug.WarnLabelf("sticky-notes", "there's some error while loading data, returning default data instead...")
		}
		return []StickyNoteData{}
	}
	return data
}
