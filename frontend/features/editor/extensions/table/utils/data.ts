import { DEFAULT_VALUE_MAPPING } from "../constants"

export function getTableDefaultData(type: TableDataType) {
  return DEFAULT_VALUE_MAPPING[type]
}