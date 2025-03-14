import { BsGearFill, BsPlus } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonSizeVariant, createLazyLoadedDropdownMenu, FlexCenterY } from "~/components"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  buttonRow: {
    gap: 5
  }
})

export function BlockButtonRow(props: HTMLAttributes<"div">) {
  const AddBlockMenu = createLazyLoadedDropdownMenu(
    () => (
      <Button size$={ButtonSizeVariant.icon}>
        <BsPlus />
      </Button>
    ),
    () => import('./BlockAddListMenu')
  )

  const SettingBlockMenu = createLazyLoadedDropdownMenu(
    () => (
      <Button size$={ButtonSizeVariant.icon}>
        <BsGearFill />
      </Button>
    ),
    () => import('./BlockSettingMenu')
  )

  return (
    <FlexCenterY {...props} class={mergeClassname(stylex.attrs(style.buttonRow), props)}>
      <AddBlockMenu.DropdownMenu$ />
      <SettingBlockMenu.DropdownMenu$ />
    </FlexCenterY>
  )
}