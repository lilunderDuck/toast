import stylex from "@stylexjs/stylex"
import { lazy, Show } from "solid-js"
import { FlexCenterY, HoverCard, HoverCardContent, HoverCardTrigger, Spacer, Tag } from "~/components"

const style = stylex.create({
  thisBox: {
    gap: 15,
    paddingInline: 10,
    paddingBlock: 5,
  },
  nameWithNoLinks: {
    ':hover': {
      textDecoration: 'underline'
    }
  },
  icon: {
    width: 20,
    height: 20,
    background: "center center no-repeat var(--lib-box-icon-url)",
    backgroundSize: 'contain'
  },
  heading: {
    gap: 15
  }
})

export interface ILibaryUsedBoxProps {
  iconUrl?: string
  name?: string
  author?: string
  description?: string
  version?: string
  url?: string
}

export default function LibaryUsedBox(props: ILibaryUsedBoxProps) {
  const LibaryInfoCard = lazy(() => import('./LibaryInfoCard'))

  const Name = () => (
    <Show when={props.url} fallback={
      <span {...stylex.attrs(style.nameWithNoLinks)}>
        {props.name}
      </span>
    }>
      <a href={props.url} target="_blank">{props.name}</a>
    </Show>
  )

  return (
    <FlexCenterY as$="span" {...stylex.attrs(style.heading)}>
      <HoverCard>
        <HoverCardTrigger {...stylex.attrs(style.thisBox)}>
          <Name />
        </HoverCardTrigger>
        <HoverCardContent>
          <LibaryInfoCard {...props} />
        </HoverCardContent>
      </HoverCard>
      <Spacer />
      <Tag>
        {props.version}
      </Tag>
    </FlexCenterY>
  )
}