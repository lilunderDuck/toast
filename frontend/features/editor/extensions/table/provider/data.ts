type BaseColumnData<T = TableDataType> = {
  key: string
  label: string
  type: T
  additionalData?: unknown
}

export type ColumnData =
  BaseColumnData |
  TagColumnData
// ...

export type TagColumnData = BaseColumnData<TableDataType.TAG> & { additionalData: { tags: TagData[] } }

export type RowData = Record<string, any>

export type TagData = { name: string, color: string }

export const DEFAULT_VALUE_MAPPING = {
  [TableDataType.CHECKBOX]: false,
  [TableDataType.DATE]: new Date(),
  [TableDataType.LINK]: '',
  [TableDataType.NUMBER]: 0,
  [TableDataType.PROGRESS]: 0,
  [TableDataType.TAG]: [],
  [TableDataType.TEXT]: ''
} satisfies Record<TableDataType, any>

export type TableDefaultValueMapping<T extends TableDataType> =
  typeof DEFAULT_VALUE_MAPPING[T]
// ...

export type TableAttribute = {
  id: string
}