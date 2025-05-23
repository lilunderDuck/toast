import stylex from "@stylexjs/stylex"
import { Button, ButtonSizeVariant, FlexCenterY } from "~/components"
import { useListDataContext } from "../provider"

const style = stylex.create({
  buttonList: {
    marginBottom: 10
  },
  listItem: {
    gap: 10
  }
})

export function ListHeader() {
  const { addItem$ } = useListDataContext()

  return (
    <FlexCenterY {...stylex.attrs(style.buttonList)}>
      <Button size$={ButtonSizeVariant.sm} onClick={addItem$}>
        Add new item
      </Button>
    </FlexCenterY>
  )
}