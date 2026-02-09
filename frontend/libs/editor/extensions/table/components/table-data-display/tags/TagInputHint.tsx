import { BsPlus } from "solid-icons/bs"
import { Button, PopoverHexColorInput, Spacer, Tag } from "~/components"
import { useTagInputContext } from "./TagInputProvider"
import { Show, type Accessor, type Setter } from "solid-js"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  inputHint: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    flexWrap: "wrap"
  },
  inputHint__createButton: {
    gap: 10
  }
})

interface ITagInputHintProps {
  color$: Accessor<string>
  setColor$: Setter<string>
  onCreateNewTag$(): void
}

export default function TagInputHint(props: ITagInputHintProps) {
  const { tagHint$ } = useTagInputContext()

  return (
    <Show when={tagHint$()}>
      <section {...stylex.attrs(style.inputHint)}>
        <Button
          size$={ButtonSize.SMALL}
          {...stylex.attrs(style.inputHint__createButton)}
          onClick={props.onCreateNewTag$}
        >
          <BsPlus />
          Create
        </Button>
        <Tag color$={props.color$()}>
          {tagHint$()!.name$}
        </Tag>
        <Spacer />
        <PopoverHexColorInput color$={props.color$} setColor$={props.setColor$} />
      </section>
    </Show>
  )
}