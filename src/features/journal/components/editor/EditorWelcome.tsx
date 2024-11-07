import stylex from "@stylexjs/stylex"
import { Button, ButtonSizeVariant, FlexCenter } from "~/components"

const style = stylex.create({
  welcome: {
    width: '100%',
    height: '100%',
    userSelect: 'none'
  }
})

export default function EditorWelcome() {
  const walkthourgh = async() => {
    (await import('../../utils/tour')).default()
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