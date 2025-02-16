import { BsGearFill, BsPlus } from "solid-icons/bs"
import { lazy } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonSizeVariant, FlexCenterY } from "~/components"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  buttonRow: {
    gap: 5
  }
})

export function BlockButtonRow(props: HTMLAttributes<"div">) {
  const AddBlockMenu = lazy(() => import('./BlockAddListMenu'))

  return (
    <FlexCenterY {...props} class={mergeClassname(stylex.attrs(style.buttonRow), props)}>
      <AddBlockMenu trigger$={
        <Button size$={ButtonSizeVariant.icon}>
          <BsPlus />
        </Button>
      } />
      <Button size$={ButtonSizeVariant.icon}>
        <BsGearFill />
      </Button>
    </FlexCenterY>
  )
}