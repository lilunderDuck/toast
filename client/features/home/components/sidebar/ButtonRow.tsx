import stylex from "@stylexjs/stylex"
import { Button, ButtonSizeVariant, ButtonVariant, Flex, Spacer } from "client/components"

const style = stylex.create({
  $infoList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(40%, 1fr))',
    gap: 15
  },
  on$lyOnBottom: {
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
    <Flex {...stylex.attrs(style.on$lyOnBottom)}>
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