import { BsBorderAll } from "solid-icons/bs"
// ...
import { 
  ContextMenuItemIcon, 
  ContextMenuPortal, 
  ContextMenuSub, 
  ContextMenuSubContent, 
  ContextMenuSubTrigger, 
} from "~/components"
// ...
import { ITextContext, TextFormatting } from "../../provider"
import createBorderFormatting from "./BorderFormatting"

export function createBorder(dataIn: TextFormatting, currentIndex: number, updateDataFn: ITextContext["updateData$"]) {
  const BorderLeftFormatting = createBorderFormatting('left', dataIn, currentIndex, updateDataFn)
  const BorderRightFormatting = createBorderFormatting('right', dataIn, currentIndex, updateDataFn)
  const BorderTopFormatting = createBorderFormatting('top', dataIn, currentIndex, updateDataFn)
  const BorderBottomFormatting = createBorderFormatting('bottom', dataIn, currentIndex, updateDataFn)

  const BorderSubMenu = () => (
    <ContextMenuSub overlap>
      <ContextMenuSubTrigger>
        <ContextMenuItemIcon>
          <BsBorderAll />
        </ContextMenuItemIcon>
        Border
      </ContextMenuSubTrigger>
      <ContextMenuPortal>
        <ContextMenuSubContent>
          <BorderLeftFormatting />
          <BorderRightFormatting />
          <BorderTopFormatting />
          <BorderBottomFormatting />
        </ContextMenuSubContent>
      </ContextMenuPortal>
    </ContextMenuSub>
  )

  return BorderSubMenu
}