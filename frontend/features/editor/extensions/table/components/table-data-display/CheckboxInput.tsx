import { Checkbox } from "~/components";
import type { ITableDataTypeComponentProps } from "./TableDataItem";

export default function CheckboxInput(props: ITableDataTypeComponentProps<boolean>) {
  return (
    <Checkbox 
      onChange={(value) => props.onChange$(value)}
      value={`${props.value$}`}
    />
  )
}