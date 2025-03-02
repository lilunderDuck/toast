import { createSignal } from "solid-js";
import { BsPencilSquare } from "solid-icons/bs";
// ...
import { 
  ContextMenuItemIcon, 
  ContextMenuPortal, 
  ContextMenuSub, 
  ContextMenuSubContent, 
  ContextMenuSubTrigger 
} from "~/components";
// ...
import { ITextContext, TextOption } from "../../provider";
import { handle } from "../../utils";
import PaddingItem from "./PaddingItem";
import PaddingPreviewer from "./PaddingPreviewer";

export function createPadding(dataIn: TextOption, currentIndex: number, updateDataFn: ITextContext["updateData$"]) {
  const [paddingLeft, setPaddingLeft] = createSignal(dataIn.paddingLeft ?? 0)
  const [paddingRight, setPaddingRight] = createSignal(dataIn.paddingRight ?? 0)
  const [paddingTop, setPaddingTop] = createSignal(dataIn.paddingTop ?? 0)
  const [paddingBottom, setPaddingBottom] = createSignal(dataIn.paddingBottom ?? 0)

  const updatePaddingLeft = handle((input: number) => {
    updateDataFn(currentIndex, {
      left: {
        pad: input
      }
    })
  }, setPaddingLeft) 

  const updatePaddingRight = handle((input: number) => {
    updateDataFn(currentIndex, {
      right: {
        pad: input
      }
    })
  }, setPaddingRight) 

  const updatePaddingTop = handle((input: number) => {
    updateDataFn(currentIndex, {
      top: {
        pad: input
      }
    })
  }, setPaddingTop) 

  const updatePaddingBottom = handle((input: number) => {
    updateDataFn(currentIndex, {
      bottom: {
        pad: input
      }
    })
  }, setPaddingBottom) 

  const PaddingSubMenu = () => (
    <ContextMenuSub overlap>
      <ContextMenuSubTrigger>
        <ContextMenuItemIcon>
          <BsPencilSquare />
        </ContextMenuItemIcon>
        Padding
      </ContextMenuSubTrigger>
      <ContextMenuPortal>
        <ContextMenuSubContent>
          <PaddingItem label$="Padding left" value$={paddingLeft()} onChange$={updatePaddingLeft} />
          <PaddingItem label$="Padding right" value$={paddingRight()} onChange$={updatePaddingRight} />
          <PaddingItem label$="Padding top" value$={paddingTop()} onChange$={updatePaddingTop} />
          <PaddingItem label$="Padding bottom" value$={paddingBottom()} onChange$={updatePaddingBottom} />
          <PaddingPreviewer 
            paddingLeft$={paddingLeft()}
            paddingRight$={paddingRight()}
            paddingTop$={paddingTop()}
            paddingBottom$={paddingBottom()}
          />
        </ContextMenuSubContent>
      </ContextMenuPortal>
    </ContextMenuSub>
  )

  return {
    PaddingSubMenu$: PaddingSubMenu
  }
}