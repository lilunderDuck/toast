import { type Accessor, createSignal } from "solid-js"
// ...
import { editorLog } from "~/features/debug"
// ...
import type { EditorSessionStorage } from "./EditorProvider"

export interface IButtonRowUtils {
  /**Updates the position of the button row and also set `"currentBlock"` to `sessionStorage` to...
   * make some basic editor editing functionality works.
   * @param blockRef A reference to the block element.
   * @returns *nothing*
   */
  updatePosition$(blockRef: HTMLDivElement): void
  /**An accessor for the current position of the button row. */
  currentPosition$: Accessor<{
    x: number,
    y: number
  }>
}

export function createButtonRow(wrappedSessionStorage: EditorSessionStorage) {
  const [currentPos, setCurrentPos] = createSignal({
    x: 0,
    y: 0
  })

  const updatePosition: IButtonRowUtils["updatePosition$"] = (blockRef) => {
    const newPosition = {
      x: 0, // ignored
      y: blockRef.offsetTop
    }

    setCurrentPos(newPosition)

    wrappedSessionStorage.set$('currentBlock', parseInt(blockRef.dataset!.id ?? ''))
    isDevMode && editorLog.log("Moved button row to", newPosition)
  }

  return {
    updatePosition$: updatePosition,
    currentPosition$: currentPos
  }
}