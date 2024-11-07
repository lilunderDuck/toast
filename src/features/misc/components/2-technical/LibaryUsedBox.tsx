import stylex from "@stylexjs/stylex"
import { Show } from "solid-js"
import { FlexCenterY, Tag } from "~/components"

const style = stylex.create({
  thisBox: {
    gap: 15,
    paddingInline: 15,
    paddingBlock: 10
  },
  icon: {
    width: 20,
    height: 20,
    background: "center center no-repeat var(--lib-box-icon-url)",
    backgroundSize: 'contain'
  },
  description: {
    fontSize: 14,
    color: 'var(--gray10)'
  },
  heading: {
    gap: 15
  }
})

export interface ILibaryUsedBoxProps {
  iconUrl?: string
  name?: string
  description?: string
  version?: string
  url?: string
}

export default function LibaryUsedBox(props: ILibaryUsedBoxProps) {
  return (
    <div {...stylex.attrs(style.thisBox)}>
      <FlexCenterY $as="span" {...stylex.attrs(style.heading)}>
        <Show when={props.iconUrl}>
          <div {...stylex.attrs(style.icon)} style={{
            '--lib-box-icon-url': `url('${props.iconUrl}')`
          }} />
        </Show>
        <Show when={props.url} fallback={
          <span>{props.name}</span>
        }>
          <a href={props.url} target="_blank">{props.name}</a>
        </Show>
        <Tag>{props.version}</Tag>
      </FlexCenterY>

      <span {...stylex.attrs(style.description)}>
        {props.description}
      </span>
    </div>
    // <FlexCenterY {...stylex.attrs(style.thisBox)} style={{
    //   '--lib-box-icon-url': `url('${props.iconUrl}')`
    // }}>
      
    // </FlexCenterY>
  )
}