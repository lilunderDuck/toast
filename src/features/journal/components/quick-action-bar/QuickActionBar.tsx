import { BsFileFill, BsGearFill, BsLayoutWtf, BsSearchHeart } from "solid-icons/bs"
// ...
import { Flex, Spacer } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./QuickActionBar.module.css"
// ...
import { QuickActionItem } from "./QuickActionItem"

const style = stylex.create({
  bar: {
    width: 'var(--icon-bound)',
    flexFlow: 'column',
    justifyContent: 'flex-start',
    gap: 5,
    paddingBlock: 5
  }
})

export function QuickActionBar() {
  return (
    <Flex editor-tour-quick-action-bar id={__style.actionBar} {...stylex.attrs(style.bar)}>
      <QuickActionItem 
        $icon={BsFileFill}
      />
      <QuickActionItem 
        $icon={BsSearchHeart}
      />
      <QuickActionItem 
        $icon={BsLayoutWtf}
      />
      <Spacer />
      <QuickActionItem 
        $icon={BsGearFill}
      />
    </Flex>
  )
}