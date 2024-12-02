import { JournalInfoSidebar, JournalList } from "~/features/journal-home"
import { mergeClassname } from "~/utils"
import { Flex } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "~/features/home/index.module.css"
// ...

const style = stylex.create({
  $homePage: {
    width: '100%',
    height: '100%',
  },
  $content: {
    width: '100%',
    height: '100%',
    paddingLeft: 20
  }
})

export default function HomePage() {
  return (
    <Flex class={mergeClassname(stylex.attrs(style.$homePage))}>
      <div app-scrollbar app-scrollbar-vertical class={mergeClassname(
        stylex.attrs(style.$content), 
        __style.scrollbar
      )}>
        <h1>Home</h1>
        <br />
        <h2>Your stuff</h2>
        {/* <Show when={!resource.loading}> */}
        <JournalList />
        {/* </Show> */}
      </div>
      <JournalInfoSidebar />
    </Flex>
  )
}