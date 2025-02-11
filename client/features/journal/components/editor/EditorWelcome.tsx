import stylex from "@stylexjs/stylex"
// ...
import { FlexCenter } from "~/components"
// ...
import EditorStep from "./EditorStep"
import { BsHouseFill, BsPencilFill, BsPlus } from "solid-icons/bs"

const style = stylex.create({
  welcome: {
    width: '100%',
    height: '100%',
    userSelect: 'none',
    backgroundColor: 'var(--gray2)',
    flexFlow: 'column',
    // ahh, good ol' position trick to center a <div>
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    marginTop: 30,
  },
  stepList: {
    marginTop: 15
  }
})

export function EditorWelcome() {
  return (
    <FlexCenter {...stylex.attrs(style.welcome)}>
      <h3>You just landed</h3>
      <div>
        Currently there's nothing here... but here's a few thing you can do:
        <div {...stylex.attrs(style.stepList)}>
          <EditorStep icon$={BsPlus} $stuff='Create new journal' />
          <EditorStep icon$={BsPencilFill} $stuff='Edit existing journal' />
          <EditorStep icon$={BsHouseFill} $stuff='Go back to home' />
        </div>
      </div>
    </FlexCenter>
  )
}