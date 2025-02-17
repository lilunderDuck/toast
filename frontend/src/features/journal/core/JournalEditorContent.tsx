import stylex from "@stylexjs/stylex"
// ...
import { FlexCenter, ResizablePanel } from "~/components"
import { Editor, useEditorContext } from "~/features/editor-core"
// ...
import { useJournalContext } from "../context"

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

export function JournalEditorContent() {
  const { journal$ } = useJournalContext()
  const { event$ } = useEditorContext()

  const shouldSave = () => {
    return journal$.currentlyOpened$() !== undefined
  }

  event$.on$('editor__onSwitching', async(previousData) => {
    if (!shouldSave()) return console.log('not open anything')

    if (previousData) {
      await journal$.save$(previousData.id, previousData.content)
    }
  })

  event$.on$('editor__onUpdate', async(data) => {
    if (!shouldSave()) return console.log('not open anything')
    
    await journal$.save$(data.id, data.content)
  })

  return (
    <ResizablePanel initialSize={0.7}>
      <div {...stylex.attrs(style.content)}>
        <FlexCenter {...stylex.attrs(style.titleBar)}>
          {journal$.currentlyOpened$() ? journal$.currentlyOpened$()?.name : '*Nothing opened*'}
        </FlexCenter>
        <Editor />
      </div>
    </ResizablePanel>
  )
}