import { BsGearFill, BsPlus } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonSizeVariant, createLazyLoadedDropdownMenu, FlexCenterY } from "~/components"
import { mergeClassname } from "~/utils"
import { splitProps } from "solid-js"

const style = stylex.create({
  buttonRow: {
    gap: 5
  },
  blockSetting: {
    position: 'absolute',
    transform: 'translate(calc(var(--x) * -1), var(--y))',
    right: 0,
    top: 0,
    willChange: 'transform',
    marginRight: 10
  }
})

interface IBlockButtonRowProps extends HTMLAttributes<"div"> {
  currentYPosition$: number
}

export function BlockButtonRow(props: IBlockButtonRowProps) {
  const [, everythingElse] = splitProps(props, ["currentYPosition$"])
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
    <div {...stylex.attrs(style.blockSetting)} style={{
      '--y': `${props.currentYPosition$}px`,
      '--x': `0px`,
    }}>
      <FlexCenterY {...everythingElse} class={mergeClassname(stylex.attrs(style.buttonRow), props)}>
        <AddBlockMenu.DropdownMenu$ />
        <SettingBlockMenu.DropdownMenu$ />
      </FlexCenterY>
    </div>
  )
}