import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonSizeVariant, ButtonVariant, Flex, Spacer } from "~/components"

const style = stylex.create({
  onlyOnBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 10,
    gap: 10
  }
})

interface IButtonRowOnTheBottomProps {
  onClickingClose$: () => any
  onClickingOpen$: () => any
}

export default function ButtonRowOnTheBottom(props: IButtonRowOnTheBottomProps) {
  return (
    <Flex {...stylex.attrs(style.onlyOnBottom)}>
      <Spacer />
      <Button 
        size$={ButtonSizeVariant.sm} 
        variant$={ButtonVariant.danger}
        onClick={props.onClickingClose$}
      >
        Close
      </Button>
      <Button size$={ButtonSizeVariant.sm} onClick={props.onClickingOpen$}>
        Open this
      </Button>
    </Flex>
  )
}