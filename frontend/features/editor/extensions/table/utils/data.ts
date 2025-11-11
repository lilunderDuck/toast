const DEFAULT_VALUE_MAPPING = {
  [TableDataType.CHECKBOX]: false,
  [TableDataType.DATE]: new Date(),
  [TableDataType.LINK]: '',
  [TableDataType.NUMBER]: 0,
  [TableDataType.PROGRESS]: 0,
  [TableDataType.TAG]: [],
  [TableDataType.TEXT]: ''
} satisfies Record<TableDataType, any>

export function getTableDefaultData(type: TableDataType) {
  return DEFAULT_VALUE_MAPPING[type]
}