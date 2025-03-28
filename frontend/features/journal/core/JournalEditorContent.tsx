import { ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { FlexCenter, ResizablePanel } from "~/components"
import { useEditorContext } from "~/features/editor"
// ...
import { useJournalContext } from "../context"
import { TabList } from "../components"

const style = stylex.create({
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--gray2)',
    position: 'relative'
  },
  tabs: {
    paddingInline: 5,
    gap: 5,
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap'
  },
  editor: {
    height: 'calc(100vh - 72px)'
  },
  titleBar: {
    height: 30,
    width: '100%',
    fontSize: 13,
    marginBottom: 10
  }
})

export function JournalEditorContent(props: ParentProps) {
  const { journal$ } = useJournalContext()
  const { event$: editorEvent } = useEditorContext()

  const shouldSave = () => {
    return journal$.currentlyOpened$() !== undefined
  }

  editorEvent.on$('editor__onSwitching', async(previousData) => {
    if (!shouldSave()) return console.log('not open anything')

    if (previousData) {
      await journal$.save$(previousData.id, previousData.content)
    }
  })

  editorEvent.on$('editor__onUpdate', async(data) => {
    if (!shouldSave()) return console.log('not open anything')
    
    await journal$.save$(data.id, data.content)
  })

  return (
    <ResizablePanel initialSize={0.7}>
      <TabList />
      <div {...stylex.attrs(style.content)}>
        <FlexCenter {...stylex.attrs(style.titleBar)}>
          {journal$.currentlyOpened$() ? journal$.currentlyOpened$()?.name : '*Nothing opened*'}
        </FlexCenter>
        {props.children}
      </div>
    </ResizablePanel>
  )
}