/**Sets the cursor to the end of the content of an HTML element.
 * @param someElement The HTML element to set the cursor to the end of.
 * @returns *nothing*
 */
export function setCaretToTheEnd(someElement: HTMLElement) {
  console.assert(someElement, "Element not found")
  
  // focus the element 
  someElement.focus()

  // do a bunch of stuff that I don't know what I am doing
  const textNode = someElement.firstChild
  const selection = window.getSelection()
  if (!textNode || !selection) return
  
  const range = document.createRange()
  const caret = (someElement.textContent ?? '').trim().length
  
  range.setStart(textNode, caret)
  range.setEnd(textNode, caret)
  selection.removeAllRanges()
  selection.addRange(range)
  // focus the element again to actually make you type
  someElement.focus()
}