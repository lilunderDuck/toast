import { Flex } from "~/components"
import { QuickActionBar, Sidebar, TabPanel } from "./components"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  sidebar: {
    width: '100%',
    height: '100%'
  }
})

export function JournalSidebar() {
  return (
    <TabPanel initialSize={0.3}>
      <Flex {...stylex.attrs(style.sidebar)}>
        <QuickActionBar />
        <Sidebar />
      </Flex>
    </TabPanel>
  )
}