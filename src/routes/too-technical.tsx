import stylex from "@stylexjs/stylex"
import __style from "~/features/misc/TooTechnicalPage.module.css"
import { LibarySearchBox, MemoryUsage } from "~/features/misc"
import { createSignal } from "solid-js"

const style = stylex.create({
  page: {
    paddingInline: 15,
    paddingTop: 10,
    width: '100%',
    height: '100%',
    paddingBottom: '4rem',
  },
  libList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr'
  }
})

export default function TooTechnicalPage() {
  const [value, setValue] = createSignal<string>()
  
  return (
    <div {...stylex.attrs(style.page)} id={__style.thisPage} app-scrollbar app-scrollbar-vertical>
      <h1>Hello world!</h1>
      <span>This is where you can explore the *technical part* of this app</span>
      <section>
        <LibarySearchBox
          $title="Which libraries did this app used..." 
          $options={[
            "client",
            "server",
            "build tools"
          ]}
          $placeholder="[insert thing to search here]"
          $value={value}
          $onSelect={setValue}
        />
      </section>
      <section>
        <h1>Resource usage</h1>
        <MemoryUsage />
      </section>
    </div>
  )
}