import stylex from "@stylexjs/stylex"
import { ILibaryUsedBoxProps } from "./LibaryUsedBox"
import { Flex, Tag } from "~/components"

const style = stylex.create({
  stuffInside: {
    fontSize: 14
  }
})

export default function LibaryInfoCard(props: ILibaryUsedBoxProps) {
  return (
    <div {...stylex.attrs(style.stuffInside)}>
      <section>
        <h3>{props.name}</h3>
        <span>
          {props.description}
        </span>
      </section>
      <Flex as$='section'>
        Version: <Tag>{props.version}</Tag>
      </Flex>
    </div>
  )
}