import { IconTypes } from "solid-icons"
import { ParentProps } from "solid-js"
import { 
  ContextMenuItemIcon, 
  ContextMenuPortal, 
  ContextMenuSub, 
  ContextMenuSubContent, 
  ContextMenuSubTrigger 
} from "~/components"

interface IColorPickerSubMenuProps {
  icon$: IconTypes
  text$: string
}

export default function ColorPickerSubMenu(props: ParentProps<IColorPickerSubMenuProps>) {
  return (
    <ContextMenuSub overlap>
      <ContextMenuSubTrigger>
        <ContextMenuItemIcon>
          <props.icon$ />
        </ContextMenuItemIcon>
        {props.text$}
      </ContextMenuSubTrigger>
      <ContextMenuPortal>
        <ContextMenuSubContent>
          {props.children}
        </ContextMenuSubContent>
      </ContextMenuPortal>
    </ContextMenuSub>
  )
}