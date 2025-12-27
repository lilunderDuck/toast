import { useDocumentEventListener } from "~/hooks"
// ...
import { useTableContext } from "../../../provider"

import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  resizeHandle: {
    position: "absolute",
    top: "0",
    right: "0",
    zIndex: 10,
    width: "0.5rem",
    height: "100%",
    cursor: "col-resize",
    ":hover": {
      backgroundColor: "var(--blue9)"
    }
  },
  resizeHandle__active: {
    backgroundColor: "var(--blue9)"
  }
})

interface ITableResizeHandleProps {
  currentIndex$: number
}

export function TableResizeHandle(props: ITableResizeHandleProps) {
  const { draggedColumnIndex$, resizingColumnIndex$, startX$, /*columnWidths$*/ } = useTableContext()
  const startResize = (e: EventType<"div", "onMouseDown">, index: number) => {
    e.preventDefault()
    // Prevent drag and resize conflict
    if (draggedColumnIndex$.get$()) return

    draggedColumnIndex$.set$(index)
    startX$.set$(e.clientX)

    // Add global listeners to ensure we catch mouseup/mousemove outside the table
    mouseMoveHandler.attach$()
    mouseUpHandler.attach$()

    // Change body cursor style to indicate resizing
    document.body.style.cursor = 'col-resize'
  }

  const mouseMoveHandler = useDocumentEventListener('mousemove', (e) => {
    if (resizingColumnIndex$.get$() === null) return

    const currentIndex = resizingColumnIndex$.get$()
    if (props.currentIndex$ !== currentIndex) {
      return
    }

    const deltaX = e.clientX - startX$.get$()!

    // columnWidths$.set$(prevWidths => {
    //   const newWidths = [...prevWidths]
    //   const currentWidth = newWidths[props.currentIndex$]

    //   const newWidth = Math.max(TABLE_MINIMUM_COLUMN_WIDTH, currentWidth + deltaX)

    //   if (newWidth !== currentWidth) {
    //     newWidths[props.currentIndex$] = newWidth
    //     // Only update startX if width actually changed (prevents jitter)
    //     startX$.set$(e.clientX)
    //   }

    //   return newWidths
    // })
  })

  const mouseUpHandler = useDocumentEventListener('mouseup', (e) => {
    resizingColumnIndex$.set$(undefined)
    startX$.set$(undefined)
    mouseUpHandler.detach$()
    mouseMoveHandler.detach$()
    document.body.style.cursor = 'default'
  })

  return (
    <div
      class={MERGE_CLASS(
        stylex.attrs(style.resizeHandle),
        resizingColumnIndex$.get$() === props.currentIndex$ ? stylex.attrs(style.resizeHandle__active) : ''
      )}
      onMouseDown={(e) => startResize(e, props.currentIndex$)}
    />
  )
}