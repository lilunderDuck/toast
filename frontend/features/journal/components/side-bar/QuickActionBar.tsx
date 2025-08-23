import { type ParentProps } from "solid-js"
import { BsGearFill, BsPlusSquareFill } from "solid-icons/bs"
// ...
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./QuickActionBar.module.css"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
import { shorthands } from "~/styles/shorthands"
// ...
import { ButtonRow, type IButtonRowProps, INSERT_SPACER_HERE } from "./ButtonRow"
import { createJournalSettingPage } from "../settings"
import { createLazyLoadedDialog } from "~/components"
import { useJournalContext } from "../../provider"

const style = stylex.create({
  bar: {
    // gap: 5
  },
  content: {
    flexShrink: 0,
    height: "calc(100% - var(--top-header-height))"
  },
  actionBar: {
    paddingInline: 5,
    gap: 10,
    paddingBlock: 5,
    flexFlow: "column"
  },
  explorer: {
    width: "calc(100% - 7 * 5px)",
    paddingLeft: 5,
    paddingBlock: 5,
  }
})

export function QuickActionBar(props: ParentProps) {
  const SettingDialog = createJournalSettingPage()
  const CreateJournalDialog = createLazyLoadedDialog(
    () => import("./dialog/CreateJournalDialog"),
    () => ({
      context$: useJournalContext()
    })
  )

  const buttonsRowItem: IButtonRowProps["items$"] = [
    { 
      tooltipDirection$: "right", 
      icon$: BsPlusSquareFill, 
      tooltipLabel$: "Create new journal" ,
      onClick$: CreateJournalDialog.show$
    },
    INSERT_SPACER_HERE,
    { 
      tooltipDirection$: "right", 
      icon$: BsGearFill, 
      tooltipLabel$: "Open setting",
      onClick$: SettingDialog.show$
    },
  ]

  return (
    <aside {...stylex.attrs(style.bar, shorthands.flex$, shorthands.h_full$)}>
      <div 
        {...stylex.attrs(
          style.content, 
          style.actionBar, 
          shorthands.flex_x_center$
        )}
        id={__style.bar}
      >
        <ButtonRow items$={buttonsRowItem} />
      </div>
      <div 
        class={mergeClassname(
          stylex.attrs(style.content, style.explorer, shorthands.h_full$),
          __scrollbarStyle.scrollbar,
          __scrollbarStyle.scrollbarVertical,
        )}
      >
        {props.children}
      </div>

      <SettingDialog.Modal$ />
      <CreateJournalDialog.Modal$ />
    </aside>
  )
}