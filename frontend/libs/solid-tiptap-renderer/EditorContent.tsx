import type { SolidEditor } from "./editor"
import type { SolidRenderer } from "./SolidRenderer"
import { createRef } from "./ref"
import { For, createEffect, on, onCleanup, type JSX, splitProps } from "solid-js"
import { Dynamic, Portal } from "solid-js/web"

interface IPortalsProps {
  renderers: SolidRenderer[]
}

function Portals(props: IPortalsProps) {
  return (
    <For each={props.renderers}>
      {(renderer) => {
        return (
          <Portal mount={renderer.element}>
            <Dynamic component={renderer.component} state={renderer.state()} />
          </Portal>
        )
      }}
    </For>
  )
}

export interface ISolidEditorContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  editor: SolidEditor
}

export function SolidEditorContent(props: ISolidEditorContentProps) {
  const [getEditorContentContainer, setEditorContentContainer] = createRef<HTMLElement>()
  const [, passedProps] = splitProps(props, ["editor"])

  createEffect(
    on([() => props.editor], () => {
      const { editor } = props

      if (editor && editor.options.element) {
        const editorContentContainer = getEditorContentContainer()

        if (editorContentContainer) {
          editorContentContainer.append(...editor.options.element.childNodes)
          editor.setOptions({
            element: editorContentContainer
          })
        }

        setTimeout(() => {
          if (!editor.isDestroyed) {
            editor.createNodeViews()
          }
        }, 0)
      }
    })
  )

  onCleanup(() => {
    const { editor } = props

    if (!editor) {
      return
    }

    if (!editor.isDestroyed) {
      // Don't know why this throws an error, so I hacked a quick fix.
      try {
        editor.view.setProps({
          nodeViews: {}
        })
      } catch(error) {
        console.warn("[anti-crashing]", error)
      }
    }

    if (!editor.options.element.firstChild) {
      return
    }

    const newElement = document.createElement("div")

    newElement.append(...editor.options.element.childNodes)
    editor.setOptions({
      element: newElement
    })
  })

  return (
    <>
      <div {...passedProps} ref={setEditorContentContainer} data-editor />
      <Portals renderers={props.editor.renderers()} />
    </>
  )
}