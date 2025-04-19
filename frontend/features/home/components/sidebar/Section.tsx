import { JSX, splitProps } from "solid-js"
// ...
import __style from './sidebar.module.css' 

interface ISectionProps extends HTMLAttributes<"div"> {
  name$: JSX.Element
}

export function Section(props: ISectionProps) {
  const [, itsProps] = splitProps(props, ["name$"])

  return (
    <section id={__style.someSection}>
      <h3>{props.name$}</h3>
      <SectionText {...itsProps}>{props.children}</SectionText>
    </section>
  )
}

export function SectionText(props: HTMLAttributes<"div">) {
  return (
    <div {...props} id={__style.text} />
  )
}