import stylex from "@stylexjs/stylex"
import { ParentProps } from "solid-js"
// ...
import { Resizable, ResizableHandle, ResizablePanel } from "~/components"
// ...
import { QuickActionBar, Sidebar } from ".."
import { StatusBar } from "./status-bar"

const style = stylex.create({
  sidebar: {
    width: '40%'
  },
  content: {
    width: '100%',
    backgroundColor: 'var(--gray2)',
    position: 'relative'
  },
  editor: {
    position: 'absolute',
    paddingInline: 10,
    paddingTop: 5,
    zIndex: -1
  },
  button: {
    flexShrink: 0
  }
})

export function EditorContent(props: ParentProps) {
  return (
    <Resizable>
      <QuickActionBar />
      <Sidebar initialSize={0.3} />
      <ResizableHandle />
      <ResizablePanel 
        app-scrollbar 
        app-scrollbar-vertical 
        app-invs-scrollbar
        initialSize={0.7} 
        {...stylex.attrs(style.content)}
      >
        {props.children}
        <StatusBar />
      </ResizablePanel>
    </Resizable>
  )
}