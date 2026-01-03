import { Checkbox } from "~/components";
import { useEditorContext } from "~/features/editor/provider";
// ...
import type { ITableDataTypeComponentProps } from "./TableDataItem";

export default function CheckboxInput(props: ITableDataTypeComponentProps<boolean>) {
  const { isReadonly$ } = useEditorContext()  
  
  return (
    <Checkbox 
      onChange={(value) => props.onChange$(value)}
      value={`${props.value$}`}
      disabled={isReadonly$()}
    />
  )
}