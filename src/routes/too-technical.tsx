import { createSignal } from "solid-js"
import { 
  TooTechnicalPageRoot, 
  LibarySearchBox, 
  MemoryUsage, 
  Versions, 
  LibaryUsedList 
} from "~/features/technical"

export default function TooTechnicalPage() {
  const [value, setValue] = createSignal<string>()
  
  return (
    <TooTechnicalPageRoot>
      <h1>Hello world!</h1>
      <span>This is where you can explore the *technical part* of this app, a bunch of stuff smash into one place.</span>
      <section>
        <h2>App versions</h2>
        <Versions />
      </section>
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
        <LibaryUsedList />
      </section>
      <section>
        <h2>Resource usage</h2>
        <MemoryUsage />
      </section>
    </TooTechnicalPageRoot>
  )
}