import { IJournalGroupData } from "./stuff"
import { JournalVituralFileTree } from "./vituralFileTree"

export interface ICachedJournalGroupLockFile {
  [groupId: string]: IJournalGroupData
}

export interface ICachedJournalGroupTreeFile {
  journals: Record<string, JournalVituralFileTree.Data>
  tree: IJournalGroupData["tree"]
}

export interface IClientJournalGroupData extends IJournalGroupData {
  treeMapping: Record<string, JournalVituralFileTree.Data>
}