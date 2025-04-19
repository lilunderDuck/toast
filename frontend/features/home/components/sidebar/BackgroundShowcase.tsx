import { Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Flex } from "~/components"
// ...
import { SectionText } from "./Section"

const style = stylex.create({
  background: {
    width: '100%',
    height: '10rem',
    backgroundColor: 'var(--gray3)',
    paddingInline: 10,
    paddingBlock: 5,
    marginBottom: 5,
    background: "center center no-repeat var(--background)"
  },
  name: {
    alignSelf: 'flex-end',
  },
  noDesc: {
    color: 'var(--gray10)',
  }
})

interface IBackgroundShowcaseProps {
  heading$?: string
  sectionText$?: string
  icon$?: string
}

export function BackgroundShowcase(props: IBackgroundShowcaseProps) {
  return (
    <>
      <Flex 
        {...stylex.attrs(style.background)}
        style={{
          '--background': props.icon$
        }}
      >
        <h2 {...stylex.attrs(style.name)}>
          {props.heading$}
        </h2>
      </Flex>
      <SectionText>
        <Show when={props.sectionText$} fallback={
          <span {...stylex.attrs(style.noDesc)}>
            No description provided
          </span>
        }>
          {props.sectionText$}
        </Show>
      </SectionText>
    </>
  )
}