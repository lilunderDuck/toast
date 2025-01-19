import { apiRoute } from "~/common"

export const JOURNAL_ROUTE = apiRoute('/journal')
export const JOURNAL_GROUP_ROUTE = apiRoute('/journal-group')
export const JOURNAL_VIRTURAL_FILE_TREE_ROUTE = `${JOURNAL_GROUP_ROUTE}/vir-file-tree` as const