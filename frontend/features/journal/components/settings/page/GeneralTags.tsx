import { createSignal, For, lazy, Show } from "solid-js"
// ...
import { TagData } from "~/features/journal/provider"
import { Button, Input, Spacer, Tag } from "~/components"
import { CustomSettingSection } from "~/features/setting"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./GeneralTags.module.css"
import { shorthands } from "~/styles/shorthands"
// ...

const style = stylex.create({
  tagList: {
    marginTop: 10
  },
  tagCreateHeader: {
    gap: 10,
    marginBottom: 10
  },
  createTagButton: {
    flexShrink: 0
  },
  tagTable: {
    textAlign: "left"
  }
})

export default function GeneralTags() {
  return (
    <>
      <CustomSettingSection
        name$="Journal tags"
        description$="Defines a list of tag(s) to be used accoss your journal group. You can use them to categorize your journal too."
      >
        <div {...stylex.attrs(style.tagList)}>
          <TagListTable />
        </div>
      </CustomSettingSection>
    </>
  )
}

function TagListTable() {
  const tagListData: TagData[] = [
    { name: "test", description: "test description" },
    { name: "test-2", description: "test description" },
    { name: "test-2", description: "test description" },
    { name: "test-2", description: "test description" },
    { name: "test-2", description: "test description" },
    { name: "test-2", description: "test description" },
    { name: "test-2", description: "test description" },
    { name: "test-2", description: "test description" },
    { name: "test-2", description: "test description" },
  ]

  const [isShowingInput, setIsShowingInput] = createSignal(false)
  const TagInputDialog = lazy(() => import("../dialog/TagInputDialog"))

  return (
    <>
      <header {...stylex.attrs(style.tagCreateHeader, shorthands.flex_y_center$)}>
        <Input type="text" placeholder="Search tag" />
        <Spacer />
        <Button
          size$={ButtonSize.sm}
          onClick={() => setIsShowingInput(true)}
          {...stylex.attrs(style.createTagButton)}
        >
          Create tag
        </Button>
      </header>
      <table {...stylex.attrs(style.tagTable, shorthands.w_full$)}>
        <thead>
          <tr>
            <th style="width:35%">Tag</th>
            <th style="width:65%">Description</th>
          </tr>
        </thead>
        <tbody id={__style.tableBodyContent}>
          <For each={tagListData}>
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