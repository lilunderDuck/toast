import stylex from "@stylexjs/stylex"
import type { IColorInputSectionItem } from "./ColorTextSelectInput"
import { createSignal, For } from "solid-js"
import { HexColorInput } from "~/components"
import type { ChainedCommands } from "@tiptap/core"
import type { IconTypes } from "solid-icons"

const style = stylex.create({
  input__section: {
    marginBottom: 10
  },
  input__colorList: {
    display: "flex",
    gap: 5,
    flexWrap: "wrap",
  },
  input__colorListLabel: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5
  },
  input__color: {
    width: 27,
    height: 27,
    borderRadius: "50%",
    backgroundColor: "var(--color)",
    border: "2px solid transparent",
    ":hover": {
      borderColor: "var(--color)",
    }
  }
})

export default function ColorTextSelectInputSection(props: IColorInputSectionItem) {
  const [color, setColor] = createSignal('')

  return (
    <section {...stylex.attrs(style.input__section)}>
      <label {...stylex.attrs(style.input__colorListLabel)}>
        {props.name$}
      </label>
      <div {...stylex.attrs(style.input__colorList)}>
        <For each={props.colors$}>
          {color => (
            <ColorButton
              onClick$={() => props.setColor$(color)}
              color$={color}
            />
          )}
        </For>
        <HexColorInput color$={color} setColor$={setColor} />
      </div>
    </section>
  )
}

interface IColorButtonProps {
  color$?: string
  icon$?: IconTypes
  onClick$?: () => ChainedCommands
}

function ColorButton(props: IColorButtonProps) {
  return (
    <button
      {...stylex.attrs(style.input__color)}
      style={`--color:${props.color$}`}
      onClick={() => props.onClick$?.()?.run()}
    >
      {props.icon$ ? <props.icon$ /> : null}
    </button>
  )
}