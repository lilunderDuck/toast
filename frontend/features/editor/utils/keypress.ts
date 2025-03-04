/**Basically a list of defined keys that you don't want to cause some mess with.
 * @param keyYouPress 
 * @returns 
 */
export function dontUpdateIfYouPressSomeKey(keyYouPress: string) {
  const dontUpdateThose = [
    'control', 
    'shift', 
    'enter',
    'alt',
    'tab',
    'capslock',
    'numlock'
  ].includes(keyYouPress)

  const containArrowKey = keyYouPress.includes('arrow')

  return containArrowKey || dontUpdateThose
}