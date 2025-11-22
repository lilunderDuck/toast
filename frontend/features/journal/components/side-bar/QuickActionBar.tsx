import { type ParentProps } from "solid-js"
import { BsGearFill } from "solid-icons/bs"
import { MERGE_CLASS } from "macro-def"
// ...
import { Button, Spacer, Tooltip, type ITooltipOptions } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./QuickActionBar.module.css"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
// ...
import { createJournalSettingPage } from "../settings"

const style = stylex.create({
  bar: {
    display: "flex",
    height: "100%"
  },
  bar__content: {
    flexShrink: 0,
    height: "calc(100% - var(--top-header-height))",
  },
  bar__actionBar: {
    paddingInline: 5,
    gap: 10,
    paddingBlock: 5,
    display: "flex",
    justifyContent: "center",
    flexFlow: "column",
  },
  bar__explorer: {
    width: "calc(100% - 7 * 5px)",
    paddingLeft: 5,
    paddingBlock: 5,
    height: "100%"
  },
  bar__button: {
    padding: 0,
    width: 25,
    height: 25,
    borderRadius: 6,
    backgroundColor: "transparent",
    color: "var(--gray10)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ":hover": {
      backgroundColor: "var(--gray4)",
      color: "var(--gray12)",
    }
  }
})

export function QuickActionBar(props: ParentProps) {
  const SettingDialog = createJournalSettingPage()
  const tooltipOptions: ITooltipOptions["tooltipOptions$"] = {
    placement: "right"
  }

  return (
    <aside {...stylex.attrs(style.bar)}>
      <div {...stylex.attrs(style.bar__content, style.bar__actionBar)} id={__style.bar}>
        <Spacer />
        <Tooltip label$="Open setting" tooltipOptions$={tooltipOptions}>
          <Button 
            size$={ButtonSize.ICON} 
            variant$={ButtonVariant.NO_BACKGROUND} 
            onClick={SettingDialog.show$}
          >
            <BsGearFill />
          </Button>
        </Tooltip>
      </div>
      <div
        class={MERGE_CLASS(
          stylex.attrs(style.bar__content, style.bar__explorer),
          __scrollbarStyle.scrollbar,
          __scrollbarStyle.scrollbarVertical,
        )}
      >
        {props.children}
      </div>

      <SettingDialog.Dialog$ />
    </aside>
  )
}