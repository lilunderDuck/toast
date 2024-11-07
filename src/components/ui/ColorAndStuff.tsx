import { 
  ColorModeProvider, 
  ColorModeScript, 
  createLocalStorageManager 
} from "@kobalte/core/color-mode"
import { type ParentProps } from "solid-js"
import { Portal } from "solid-js/web"

export function ColorAndStuff(props: ParentProps) {
  const storageManager = createLocalStorageManager("theme")

  return (
    <>
      <Portal mount={document.head}>
        <ColorModeScript storageType={storageManager.type} />
      </Portal>
      <ColorModeProvider storageManager={storageManager}>
        {props.children}
      </ColorModeProvider>
    </>
  )
}