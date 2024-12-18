import stylex from "@stylexjs/stylex"
import { Button, ButtonSizeVariant, FlexCenter } from "~/components"

const style = stylex.create({
  welcome: {
    width: '100%',
    height: '100%',
    userSelect: 'none',
    backgroundColor: 'var(--gray2)',
    // ahh, good ol' position trick to center a <div>
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    marginTop: 30
  }
})

export function EditorWelcome() {
  const walkthourgh = async() => {
    
  }

  return (
    <FlexCenter {...stylex.attrs(style.welcome)}>
      <h3>You just landed</h3>
      <div>
        <Button $size={ButtonSizeVariant.sm} onClick={walkthourgh}>
          I want a walkthourgh
        </Button>
      </div>
    </FlexCenter>
  )
}