import { Input } from "~/components"
// ...
import { useTodoDataContext } from "../provider"

export function TodoTitleInput() {
  const { readOnly, dataIn$, dataOut$ } = useTodoDataContext()
  const [, setDataOut] = dataOut$

  const onInput: EventHandler<"input", "onInput"> = (inputEvent) => {
    const value = inputEvent.currentTarget.value
    setDataOut(prev => ({
      ...prev,
      title: value
    }))
  }

  return (
    <Input value={dataIn$.title} readOnly={readOnly} onInput={onInput} placeholder="Give this todo a name" />
  )
}