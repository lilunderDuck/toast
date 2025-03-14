package backend

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/handler/journal/blocks"
	"burned-toast/backend/handler/misc"
)

func (a *App) Journal_Create(currentGroupId int, schema *journal.JournalSchema) *journal.JournalData {
	return journal.Journal_Create(currentGroupId, schema)
}

func (a *App) Journal_Get(currentGroupId int, journalId int) (*journal.JournalData, error) {
	return journal.Journal_Get(currentGroupId, journalId)
}

func (a *App) Journal_Update(
	currentGroupId int,
	journalId int,
	newData *journal.JournalUpdateSchema,
) (*journal.JournalData, error) {
	return journal.Journal_Update(currentGroupId, journalId, newData)
}

func (a *App) Journal_Delete(currentGroupId int, journalId int) error {
	return journal.Journal_Delete(currentGroupId, journalId)
}

// ...

func (a *App) JournalGroup_Create(groupSchema *journal.JournalGroupSchema) (*journal.JournalGroupData, error) {
	return journal.Group_Create(groupSchema)
}

func (a *App) JournalGroup_Get(groupId int) (*journal.JournalGroupData, error) {
	return journal.Group_Get(groupId)
}

func (a *App) JournalGroup_GetVirTreeData(groupId int) map[string]any {
	return journal.Group_GetVirTreeData(groupId)
}

func (a *App) JournalGroup_Update(groupId int, newData *journal.JournalGroupUpdateSchema) (*journal.JournalGroupData, error) {
	return journal.Group_Update(groupId, newData)
}

func (a *App) JournalGroup_Delete(groupId int) error {
	return journal.Group_Delete(groupId)
}

func (a *App) JournalGroup_GetAll() []any {
	return journal.Group_GetAll()
}

// ...
func (a *App) Misc_GetRandomSplashText() (string, error) {
	return misc.GetRandomSplashText()
}

func (a *App) Misc_GetLibariesUsedList() (*misc.LibraryListData, error) {
	return misc.GetLibariesUsedList()
}

// ...
func (a *App) Link_GetPageInformation(url string) (*blocks.WebPageInformation, error) {
	return blocks.Link_GetPageInformation(url)
}

// ...
func (a *App) Image_SaveImage(groupId int, fileName string, content string) string {
	return blocks.Image_SaveImage(groupId, fileName, content)
}

func (a *App) Image_DeleteImage(groupId int, fileName string) {
	blocks.Image_DeleteImage(groupId, fileName)
}

func (a *App) Image_DeleteGalleryImage(groupId int, galleryId int, fileName string) {
	blocks.Image_DeleteGalleryImage(groupId, galleryId, fileName)
}

func (a *App) Image_SaveGalleryImage(groupId int, galleryId int, fileName string, content string) string {
	return blocks.Image_SaveGalleryImage(groupId, galleryId, fileName, content)
}
