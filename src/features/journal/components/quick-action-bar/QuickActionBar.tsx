import stylex from "@stylexjs/stylex"
import { BsFileFill, BsGearFill, BsLayoutWtf, BsSearchHeart } from "solid-icons/bs"
import QuickActionItem from "./QuickActionItem"
import { Flex, Spacer } from "~/components"

const style = stylex.create({
  bar: {
    width: 'var(--icon-bound)',
    flexFlow: 'column',
    justifyContent: 'flex-start',
    borderRight: '1px solid var(--gray4)',
    gap: 5,
    paddingBlock: 5
  }
})

export function QuickActionBar() {
  return (
    <Flex editor-tour-quick-action-bar {...stylex.attrs(style.bar)} style={{
      '--icon-bound': '35px'
    }}>
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