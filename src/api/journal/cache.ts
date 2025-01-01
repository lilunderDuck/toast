import { JournalApi } from "./stuff"

export interface ICachedJournalGroupLockFile {
  [groupId: string]: JournalApi.IGroupData
}

export interface ICachedJournalGroupTreeFile {
  journals: Record<string, JournalApi.Files>
  tree: JournalApi.IGroupData["tree"]
}

export interface IClientJournalGroupData extends JournalApi.IGroupData {
  treeMapping: Record<string, JournalApi.Files>
}