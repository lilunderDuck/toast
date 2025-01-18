import type { IJournalCategoryData, IJournalData, IJournalGroupData } from "./stuff"

export type CompressedJournalData = {
  0: [
    IJournalData["type"],
    IJournalData["id"],
    IJournalData["created"],
    IJournalData["modified"],
    IJournalData["name"],
    IJournalData["data"],
  ]
}

export type CompressedJournalCategoryData = {
  0: [
    IJournalCategoryData["type"],
    IJournalCategoryData["id"],
    IJournalCategoryData["created"],
    IJournalCategoryData["modified"],
    IJournalCategoryData["name"]
  ]
}

export type CompressedJournalGroupData = {
  0: [
    IJournalGroupData["id"],
    IJournalGroupData["created"],
    IJournalGroupData["modified"],
    IJournalGroupData["name"],
    IJournalGroupData["description"],
    IJournalGroupData["entries"],
    IJournalGroupData["tree"],
  ]
}