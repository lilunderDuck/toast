import { createSignal, For, lazy, Show } from "solid-js"
// ...
import { type TagData } from "~/features/journal/provider"
import { Button, Input, Spacer, Tag } from "~/components"
import { CustomSettingSection } from "~/features/setting"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./GeneralTags.module.css"
// ...

const style = stylex.create({
  tag__list: {
    marginTop: 10
  },
  tag__createHeader: {
    gap: 10,
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  tag__createTagButton: {
    flexShrink: 0
  },
  tag__table: {
    textAlign: "left",
    width: "100%",
  }
})

export default function GeneralTags() {
  return (
    <>
      <CustomSettingSection
        name$="Journal tags"
        description$="Defines a list of tag(s) to be used accoss your journal group. You can use them to categorize your journal too."
      >
        <div {...stylex.attrs(style.tag__list)}>
          <Tag__listTable />
        </div>
      </CustomSettingSection>
    </>
  )
}

function Tag__listTable() {
  const tag__listData: TagData[] = [
  ]

  const [isShowingInput, setIsShowingInput] = createSignal(false)
  const TagInputDialog = lazy(() => import("../dialog/TagInputDialog"))

  return (
    <>
      <header {...stylex.attrs(style.tag__createHeader)}>
        <Input type="text" placeholder="Search tag" />
        <Spacer />
        <Button
          size$={ButtonSize.SMALL}
          onClick={() => setIsShowingInput(true)}
          {...stylex.attrs(style.tag__createTagButton)}
        >
          Create tag
        </Button>
      </header>
      <table {...stylex.attrs(style.tag__table)}>
        <thead>
          <tr>
            <th style="width:35%">Tag</th>
            <th style="width:65%">Description</th>
          </tr>
        </thead>
        <tbody id={__style.tableBodyContent}>
          <For each={tag__listData}>
            {it => <TagTableLine {...it} />}
          </For>
        </tbody>
      </table>
      <Show when={isShowingInput()}>
        <TagInputDialog close$={() => setIsShowingInput(false)} />
      </Show>
    </>
  )
}

function TagTableLine(props: TagData) {
  return (
    <tr>
      <td>
        <Tag>#{props.name}</Tag>
      </td>
      <td>{props.description}</td>
    </tr>
  )
}