package journal

import (
	"toast/backend/db"
	"toast/backend/internals"
	"toast/backend/utils"
)

// ------ utils functions start here ------

// Gets the folder path where all of the journals metadata are being stored.
// Which is "~/data/journals/(group id)/jouwnyaws"
//
// Before you asking, "jouwnyaws" is literally "journals" but owoified.
//
// Yeah I don't know how to name this folder, you know.
func getJournalsDatabasePath(groupId int) string {
	return utils.JoinPath(internals.JOURNAL_FOLDER_PATH, utils.ToString(groupId), "jouwnyaws")
}

// Gets the folder path where all of the journals content should be stored
// Which is "~/data/journals/(group id)/stuff"
//
// Not to be confused with [getJournalContentSavedFilePath()], that function
// gets the *file* path, this one gets the *folder* path.
func getJournalContentSavedPath(groupId int) string {
	return utils.JoinPath(internals.JOURNAL_FOLDER_PATH, utils.ToString(groupId), "stuff")
}

// Gets the file path where all of the journals content should be stored
// Which is "~/data/journals/(group id)/stuff/(journal id).dat"
//
// Not to be confused with [getJournalContentSavedPath()], that function
// gets the *folder* path, this one gets the *file* path.
func getJournalContentSavedFilePath(groupId, journalId int) string {
	return utils.JoinPath(getJournalContentSavedPath(groupId), utils.ToString(journalId)+".dat")
}

// Save journal data to disk.
//
// The data is actually being saved into 2 places:
//   - The journal metadata will be saved into the leveldb's database, saved at "jouwnyaws" folder.
//   - The rest of the journal content (or document, let's call like that)
//     is stored at the "stuff" folder.
//
// The journal metadata is stored somewhere else is because we want to retrieve
// everything back to display the journal's explorer tree. We don't care about
// the journal's content, we just need the metadata to render it.
func updateJournal(groupId, journalId int, data *JournalData) error {
	err := utils.BSON_WriteFile(getJournalContentSavedFilePath(groupId, journalId), data.Data)

	if err != nil {
		return err
	}

	// make sure to save the journal metadata only, instead of both the metadata + content
	data.Data = JournalContentData{}
	return db.OpenThenClose(getJournalsDatabasePath(groupId), func(db *db.LevelDb) {
		db.SetObject(journalId, data)
	})
}

// ------ actural implementation start here ------

func (*GroupExport) CreateJournal(groupId int, journalType uint8, options JournalOptions) (*JournalData, error) {
	journalId := utils.GetRandomInt()
	newData := JournalData{
		Id:       journalId,
		Type:     journalType,
		Created:  0,
		Modified: 0,
		Name:     options.Name,
	}

	err := updateJournal(groupId, journalId, &newData)
	if err != nil {
		return nil, err
	}

	return &newData, nil
}

func (*GroupExport) GetJournal(groupId, journalId int) (*JournalData, error) {
	// Step 1. get the journal metadata
	var metadata JournalData
	err := db.OpenThenClose(getJournalsDatabasePath(groupId), func(db *db.LevelDb) {
		db.GetObject(journalId, &metadata)
	})

	if err != nil {
		return nil, err
	}

	// Step 2. get the journal content
	var journalContent JournalContentData
	err = utils.BSON_ReadFile(
		getJournalContentSavedFilePath(groupId, journalId),
		&journalContent,
	)

	// Damn, is there a way to ignore this? This error handling thing is
	// painful as hell man.
	if err != nil {
		return nil, err
	}

	// Step 3. slap that together
	metadata.Data = journalContent
	return &metadata, nil // We done
}

func (group *GroupExport) UpdateJournal(groupId, journalId int, newData *JournalOptions) (*JournalData, error) {
	data, err := group.GetJournal(groupId, journalId)
	if err != nil {
		return nil, err
	}

	// Is this the best way to update data?
	if newData.Name != "" {
		data.Name = newData.Name
	}

	if len(newData.Data.Content) != 0 {
		data.Data = newData.Data
	}

	updateJournal(groupId, journalId, data)

	return data, nil
}

func (*GroupExport) DeleteJournal(groupId, journalId int) {
	utils.RemoveFileOrDirectory(getJournalContentSavedFilePath(groupId, journalId))
	db.OpenThenClose(getJournalsDatabasePath(groupId), func(db *db.LevelDb) {
		db.DeleteObject(groupId)
	})
}
