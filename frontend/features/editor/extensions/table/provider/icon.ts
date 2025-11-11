import type { IconTypes } from "solid-icons";
import { BsBoxArrowInUp, BsCalendar, BsCheck, BsFonts, BsSliders, BsSortNumericDown, BsTagFill } from "solid-icons/bs";

export const DATA_TYPE_ICON_MAPPING: Record<TableDataType, IconTypes> = {
  [TableDataType.TEXT]: BsFonts,
  [TableDataType.NUMBER]: BsSortNumericDown,
  [TableDataType.DATE]: BsCalendar,
  [TableDataType.CHECKBOX]: BsCheck,
  [TableDataType.TAG]: BsTagFill,
  [TableDataType.PROGRESS]: BsSliders,
  [TableDataType.LINK]: BsBoxArrowInUp
}