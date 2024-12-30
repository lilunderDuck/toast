export function setCurrentJournalGroupId(id: string) {
  sessionStorage.setItem('currentGroupId', id)
}

export function getCurrentJournalGroupId() {
  return sessionStorage.getItem('currentGroupId')
}