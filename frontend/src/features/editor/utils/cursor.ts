export function setCaretToTheEnd(someElement: HTMLElement) {
  someElement.focus()
  const textNode = someElement.firstChild
  const selection = window.getSelection()
  if (!textNode || !selection) return
  
  const range = document.createRange()
  const caret = (someElement.textContent ?? '').trim().length
  
  range.setStart(textNode, caret)
  range.setEnd(textNode, caret)
  selection.removeAllRanges()
  selection.addRange(range)
  someElement.focus()
}