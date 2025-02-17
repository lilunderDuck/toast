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