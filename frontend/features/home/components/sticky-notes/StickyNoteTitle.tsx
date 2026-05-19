import type { ParentProps } from "solid-js"
import { CLS } from "macro-def"
import { BsThreeDots } from "solid-icons/bs"
// ...
import { HoveredHexColorInput } from "~/components"
import type { IContextBridge } from "~/utils"
import { createLazyLoadedDropdownMenu, createToggableInput } from "~/hooks"
// ...
import stylex from "@stylexjs/stylex"
// ...
import type { StickyNoteAction } from "./types"
import { useStickyNoteContext, type IStickyNoteContext } from "./StickyNoteProvider"

const style = stylex.create({
  block__buttonRow: {
    display: "flex",
    alignItems: "center",
    gap: 5
  },
  block__button: {
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    padding: 0,
    ":hover": {
      backgroundColor: "var(--surface0)"
    }
  },
  block__input: {
    backgroundColor: "var(--surface0)",
    color: "var(--text)",
    outline: "none",
    width: "100%",
    padding: 0,
    paddingInline: 10,
    borderRadius: 6,
  },
  block__readonlyInput: {
    width: "100%",
    overflowX: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  block__header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5
  }
})

export interface IStickyNoteTitleProps extends IActionHandler<StickyNoteAction>, IContextBridge<IStickyNoteContext> {
  shouldShowOpenFullviewOptions$?: boolean
}

export function StickyNoteTitle(props: ParentProps<IStickyNoteTitleProps>) {
  const { 
    color$,
    setColor$,
    setButtonRowShouldAlwaysShow$,
    data$,
    updateData$
  } = useStickyNoteContext() ?? props.context$!

  const { Input$ } = createToggableInput({
    component$: {
      Input$: (props) => (
        <input
          {...stylex.attrs(style.block__input)}
          {...props}
        />
      ),
      Readonly$: (props) => (
        <span {...stylex.attrs(style.block__readonlyInput)} onClick={props.onClick}>
          {props.children}
        </span>
      )
    },
    initialContent$() {
      return data$().title
    },
    onDiscard$(originalContent) {
      console.log("discard:", originalContent)
    },
    onFinalize$(newContent) {
      console.log("finalize:", newContent)
      updateData$({ title: newContent }) 
    }
  })

  const { DropdownMenu$ } = createLazyLoadedDropdownMenu(
    () => import("../dropdown/StickyNoteMoreOptionDropdown"),
    () => ({
      action$: props.action$,
      shouldShowOpenFullviewOptions$: props.shouldShowOpenFullviewOptions$
    })
  )

  return (
    <h3 {...stylex.attrs(style.block__header)}>
      <Input$ />
      <div class={`${CLS(style.block__buttonRow)} showOnHover__hide`}>
        <DropdownMenu$ onOpen$={setButtonRowShouldAlwaysShow$}>
          <button {...stylex.attrs(style.block__button)}>
            <BsThreeDots />
          </button>
        </DropdownMenu$>
        <HoveredHexColorInput
          color$={color$}
          setColor$={setColor$}
          onReset$={() => {}}
          onOpen$={setButtonRowShouldAlwaysShow$}
        />
        {props.children}
      </div>
    </h3>
  )
}