package backend

import (
	"burned-toast/backend/handler/journal"
	"burned-toast/backend/handler/journal_group"
	"burned-toast/backend/handler/misc"
)

func (a *App) Journal_Create(currentGroupId int, schema *journal.JournalSchema) *journal.JournalData {
	return journal.CreateJournal(currentGroupId, schema)
}

func (a *App) Journal_Get(currentGroupId int, journalId int) (*journal.JournalData, error) {
	return journal.GetJournal(currentGroupId, journalId)
}

func (a *App) Journal_Update(
	currentGroupId int,
	journalId int,
	newData *journal.JournalUpdateSchema,
) (*journal.JournalData, error) {
	return journal.UpdateJournal(currentGroupId, journalId, newData)
}

func (a *App) Journal_Delete(currentGroupId int, journalId int) error {
	return journal.DeleteJournal(currentGroupId, journalId)
}

// ...

func (a *App) JournalGroup_Create(groupSchema *journal_group.Schema) (*journal_group.Data, error) {
	return journal_group.Create(groupSchema)
}

func (a *App) JournalGroup_Get(groupId int) (*journal_group.Data, error) {
	return journal_group.Get(groupId)
}

func (a *App) JournalGroup_GetVirTreeData(groupId int) map[string]any {
	return journal_group.GetVirTreeData(groupId)
}

func (a *App) JournalGroup_Update(groupId int, newData *journal_group.UpdateSchema) (*journal_group.Data, error) {
	return journal_group.Update(groupId, newData)
}

func (a *App) JournalGroup_Delete(groupId int) error {
	return journal_group.Delete(groupId)
}

func (a *App) JournalGroup_GetAll() []any {
	return journal_group.GetAll()
}

// ...
func (a *App) Misc_GetRandomSplashText() (string, error) {
	return misc.GetRandomSplashText()
}

func (a *App) Misc_GetLibariesUsedList() (*misc.LibraryListData, error) {
	return misc.GetLibariesUsedList()
}
