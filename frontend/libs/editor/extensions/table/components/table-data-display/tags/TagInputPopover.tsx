import { createSignal, For, onCleanup } from "solid-js"
import { BsCheck } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TagInputPopover.module.css"
// ...
import { createInputShortcutHandler } from "~/hooks"
import { Button, Label, Input, PopoverContent, Tag } from "~/components"
// ...
import { useTagInputContext } from "./TagInputProvider"
import type { TagData } from "../../../provider"
import TagInputHint from "./TagInputHint"

const style = stylex.create({
  tagInput: {
    // 
  },
  tagInput__display: {
    display: "flex",
    alignItems: "center",
    gap: 5
  },
  tagInput__label: {
    marginBlock: 10
  },
  tagInput__item: {
    justifyContent: "flex-start",
    width: "100%",
    gap: 10
  },
  tagInput__tagWrap: {
    position: "absolute",
    marginLeft: 15
  }
})

export default function TagInputPopover() {
  const { isInSelectedOptions$, toggleSelect$, cleanSearchResult$, allOptions$, startSearching$, createNewTag$, tagHint$ } = useTagInputContext()

  let inputRef!: Ref<"input">
  const DEFAULT_COLOR = '#32a8a6' // cyan-ish color
  const [color, setColor] = createSignal(DEFAULT_COLOR)

  const searchHard: EventHandler<"input", "onInput"> = () => {
    const searchedQuery = inputRef.value
    startSearching$(searchedQuery.toLowerCase().trim())
  }

  const inputShortcut = createInputShortcutHandler({
    onDiscard$() {
      cleanSearchResult$()
    },
    onFinalize$() {
      createTag()
    },
  })

  const createTag = () => {
    createNewTag$(tagHint$()!.name$, color())
    cleanSearchResult$()
    setColor(DEFAULT_COLOR)
    inputRef.value = ''
  }

  const DummyComponentToCleanSearchResult = () => {
    onCleanup(cleanSearchResult$)

    return null
  }

  return (
    <PopoverContent id={__style.tagInput__selectMenu}>
      <Input
        placeholder="Type something..."
        onInput={searchHard}
        onKeyUp={inputShortcut}
        ref={inputRef}
      />

      <Label {...stylex.attrs(style.tagInput__label)}>
        Select tag or create a new one
      </Label>
      <For each={allOptions$()}>
        {(it: TagData) => (
          <Button
            {...stylex.attrs(style.tagInput__item)}
            variant$={ButtonVariant.NO_BACKGROUND}
            size$={ButtonSize.SMALL}
            data-tag-is-selected={isInSelectedOptions$(it.name)}
            onClick={() => toggleSelect$(it)}
          >
            <BsCheck />
            <Tag color$={it.color}>
              {it.name}
            </Tag>
          </Button>
        )}
      </For>

      <TagInputHint
        color$={color}
        setColor$={setColor}
        onCreateNewTag$={createTag}
      />

      <DummyComponentToCleanSearchResult />
    </PopoverContent>
  )
}