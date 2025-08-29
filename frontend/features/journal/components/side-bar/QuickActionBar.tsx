import { type ParentProps } from "solid-js"
import { BsGearFill, BsPlusSquareFill } from "solid-icons/bs"
// ...
import { mergeClassname } from "~/utils"
import { createLazyLoadedDialog } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./QuickActionBar.module.css"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
// ...
import { ButtonRow, type IButtonRowProps, INSERT_SPACER_HERE } from "./ButtonRow"
import { createJournalSettingPage } from "../settings"
import { useJournalContext } from "../../provider"

const style = stylex.create({
  bar: {
    display: "flex",
    height: "100%"
  },
  content: {
    flexShrink: 0,
    height: "calc(100% - var(--top-header-height))"
  },
  actionBar: {
    paddingInline: 5,
    gap: 10,
    paddingBlock: 5,
    display: "flex",
    justifyContent: "center",
    flexFlow: "column",
  },
  explorer: {
    width: "calc(100% - 7 * 5px)",
    paddingLeft: 5,
    paddingBlock: 5,
    height: "100%"
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
    <aside {...stylex.attrs(style.bar)}>
      <div 
        {...stylex.attrs(
          style.content, 
          style.actionBar,
        )}
        id={__style.bar}
      >
        <ButtonRow items$={buttonsRowItem} />
      </div>
      <div 
        class={mergeClassname(
          stylex.attrs(style.content, style.explorer),
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