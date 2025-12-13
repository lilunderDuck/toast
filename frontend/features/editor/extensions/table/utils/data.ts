import { DEFAULT_VALUE_MAPPING } from "../provider"

export function getTableDefaultData(type: TableDataType) {
  return DEFAULT_VALUE_MAPPING[type]
}