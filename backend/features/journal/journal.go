package journal

import (
	"toast/backend/internals"
	"toast/backend/utils"
)

// ------ utils functions start here ------

// Save journal data to disk.
func writeJournalData(groupId, journalId int, data *JournalData) error {
	return utils.BSON_WriteFile(internals.JournalContentSavedFilePath(groupId, journalId), data)
}

// Save the journal group icon by the given path.
//   - @param data - the journal group data
//   - @param iconPath - the icon path that you want to change. Later, it will be saved at
//     this location: "~/data/journals/[groupId]/icons/(whatever icon filename is)"
func saveAndUpdateIcon(data *JournalGroupData, iconPath string) {
	fileName := utils.GetFileNameWithExtension(iconPath)
	newLocation := utils.JoinPath(internals.GroupSavedPath(data.Id), "icons", fileName)
	utils.MoveFile(iconPath, newLocation)
	data.Icon = fileName
}

// ------ actural implementation start here ------

func (*GroupExport) CreateJournal(groupId int, journalType uint8, options JournalOptions) (*JournalData, error) {
	journalId := utils.GetRandomInt()
	newData := JournalData{
		Id:      journalId,
		Type:    journalType,
		Created: utils.GetCurrentDateNow(),
		Name:    options.Name,
	}

	if err := writeJournalData(groupId, journalId, &newData); err != nil {
		return nil, err
	}

	return &newData, nil
}

func (*GroupExport) GetJournal(groupId, journalId int) (*JournalData, error) {
	var data JournalData
	err := utils.BSON_ReadFile(internals.JournalContentSavedFilePath(groupId, journalId), &data)
	return &data, err
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

	if len(newData.Data) != 0 && newData.Data[0].Type == "doc" {
		data.Data = newData.Data[0]
	}

	data.Modified = utils.GetCurrentDateNow()

	writeJournalData(groupId, journalId, data)

	return data, nil
}

func (*GroupExport) DeleteJournal(groupId, journalId int) {
	utils.RemoveFileOrDirectory(internals.JournalContentSavedFilePath(groupId, journalId))
}
