import { ResizableTextarea } from "~/components";
import { ICodeBlockData } from "./CodeBlock";

interface ICodeTextareaProps {
  dataIn$: ICodeBlockData
  onChange$(code: ICodeBlockData): void
}

export default function CodeTextarea(props: ICodeTextareaProps) {
  return (
    <ResizableTextarea onInput={(inputEvent) => props.onChange$({
      code: inputEvent.currentTarget.value
    })} />
  )
}