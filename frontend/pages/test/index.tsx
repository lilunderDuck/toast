import { TbTestPipeOff } from "solid-icons/tb"
// ...
import { PlaceholderView } from "~/components"

export default function Home() {
  return (
    <PlaceholderView icons$={<TbTestPipeOff size={50} />}>
      No test selected
    </PlaceholderView>
  )
}