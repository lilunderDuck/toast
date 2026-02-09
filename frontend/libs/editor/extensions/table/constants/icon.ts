import type { IconTypes } from "solid-icons";
import { BsBoxArrowInUp, BsCalendar, BsCheck, BsFonts, BsSliders, BsSortNumericDown, BsTagFill } from "solid-icons/bs";

export const TABLE_DATA_TYPE_MAPPING = {
  [TableDataType.TEXT]: {
    icon$: BsFonts,
    displayName$: "Text",
  },
  [TableDataType.NUMBER]: {
    icon$: BsSortNumericDown,
    displayName$: "Number",
  },
  [TableDataType.DATE]: {
    icon$: BsCalendar,
    displayName$: "Date",
  },
  [TableDataType.CHECKBOX]: {
    icon$: BsCheck,
    displayName$: "Checkbox",
  },
  [TableDataType.TAG]: {
    icon$: BsTagFill,
    displayName$: "Tag",
  },
  [TableDataType.PROGRESS]: {
    icon$: BsSliders,
    displayName$: "Progress",
  },
  [TableDataType.LINK]: {
    icon$: BsBoxArrowInUp,
    displayName$: "Link",
  },
} satisfies Record<TableDataType, {
  icon$: IconTypes
  displayName$: string
}>

export const TABLE_DATA_TYPES = [
  TableDataType.TEXT,
  TableDataType.CHECKBOX,
  TableDataType.DATE,
  TableDataType.LINK,
  TableDataType.NUMBER,
  TableDataType.PROGRESS,
  TableDataType.TAG,
]

export const DEFAULT_VALUE_MAPPING = {
  [TableDataType.CHECKBOX]: false,
  [TableDataType.DATE]: new Date(),
  [TableDataType.LINK]: '',
  [TableDataType.NUMBER]: 0,
  [TableDataType.PROGRESS]: 0,
  [TableDataType.TAG]: [],
  [TableDataType.TEXT]: ''
} satisfies Record<TableDataType, any>

isDevMode && (() => {
  console.assert(
    Object.keys(TABLE_DATA_TYPE_MAPPING).length === Object.keys(DEFAULT_VALUE_MAPPING).length,
    "One of the TABLE_DATA_TYPE_MAPPING or DEFAULT_VALUE_MAPPING is missing one or many table data type. Please update the code."
  )
})()