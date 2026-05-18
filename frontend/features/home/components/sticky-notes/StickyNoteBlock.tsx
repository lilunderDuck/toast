import stylex from "@stylexjs/stylex"
import { CLS } from "macro-def"
import { createSignal } from "solid-js"
import { PopoverHexColorInput, Input } from "~/components"
import { createToggableInput } from "~/hooks"

const style = stylex.create({
  block: {
    width: "13.5rem",
    height: "12rem",
    borderRadius: 6,
    transition: "0.15s ease-out",
    position: "relative",
    paddingInline: 10,
    paddingBlock: 5,
  },
  block__noBackground: {
    backgroundColor: "var(--mantle)",
    ":hover": {
      backgroundColor: "var(--base)",
    },
  },
  block__withBackground: {
    "::before": {
      content: "",
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: -1,
      opacity: 0.25,
      backgroundColor: "var(--sticky-note-background-color)",
      borderRadius: 6,
    }
  },
  block__header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  block__hexColorInputTrigger: {
    borderRadius: "50%"
  }
})

interface IStickyNoteBlockProps {
  color?: string
}

export function StickyNoteBlock(props: IStickyNoteBlockProps) {
  const [color, setColor] = createSignal("#313244")

  const { Input$ } = createToggableInput({
    component$: {
      Input$: (props) => <Input {...props} />,
      Readonly$: (props) => (
        <span onClick={props.onClick}>
          {props.children}
        </span>
      )
    },
    initialContent$() {
      return "Note title"
    },
    onDiscard$(originalContent) {
      console.log("discard:", originalContent)
    },
    onFinalize$(newContent) {
      console.log("finalize:", newContent)
    }
  })

  return (
    <div 
      class={`${CLS(style.block)} ${props.color ? CLS(style.block__withBackground) : CLS(style.block__noBackground)}`}
      style={`--sticky-note-background-color:${color()}`}
    >
      <h3 {...stylex.attrs(style.block__header)}>
        <Input$ />
        <PopoverHexColorInput 
          color$={color} 
          setColor$={setColor} 
          onReset$={() => {}}
        />
      </h3>
    </div>
  )
}