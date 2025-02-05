import { IconTypes } from "solid-icons"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { FlexCenterY } from "client/components"
import { JSX } from "solid-js"

const style = stylex.create({
  step: {
    paddingBlock: 5,
    paddingInline: 12,
    width: '100%',
    gap: 30,
    fontSize: 14,
    ':nth-child(even)': {
      backgroundColor: 'var(--gray3)'
    },
    ':nth-child(odd)': {
      backgroundColor: 'var(--gray4)'
    },
    ':first-child': {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    ':last-child': {
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
    }
  }
})

interface IStepProps {
  $icon: IconTypes
  $stuff: JSX.Element
}

export default function Step(props: IStepProps) {
  return (
    <FlexCenterY {...stylex.attrs(style.step)}>
      <props.$icon />
      <div>
        {props.$stuff}
      </div>
    </FlexCenterY>
  )
}