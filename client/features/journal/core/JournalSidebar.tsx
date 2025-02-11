import { BsHouseFill } from "solid-icons/bs"
import { useNavigate } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalSidebar.module.css"
// ...
import { 
  Flex, 
  FlexCenterY, 
  ResizableHandle, 
  ResizablePanel
} from "~/components"
// ...
import { 
  QuickActionBar, 
  QuickActionItem, 
  Sidebar,
  TrackerButton, 
} from "../components"

const style = stylex.create({
  sidebar: {
    width: '100%',
    height: '100%'
  },
  titleBar: {
    padding: 5,
    gap: 5
  }
})

export function JournalSidebar() {
  const goTo = useNavigate()
  const goHome = () => goTo('/')

  return (
    <>
      <ResizablePanel initialSize={0.3}>
        <FlexCenterY id={__style.iconTitleBar} {...stylex.attrs(style.titleBar)}>
          <QuickActionItem 
            icon$={BsHouseFill}
            label$='Go back to home'
            onClick={goHome}
          />
          <div  />
          <TrackerButton />
        </FlexCenterY>
        <Flex {...stylex.attrs(style.sidebar)}>
          <QuickActionBar />
          <Sidebar />
        </Flex>
      </ResizablePanel>
      <ResizableHandle />
    </>
  )
}