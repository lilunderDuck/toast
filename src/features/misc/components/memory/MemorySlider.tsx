import stylex from "@stylexjs/stylex"
import { Flex, FlexCenterY } from "~/components"

const style = stylex.create({
  slider: {
    width: '100%',
    height: 30,
    userSelect: 'none'
  },
  sliderProgress: {
    transition: 'all 0.25s ease-out',
    width: 'var(--progress)',
    backgroundColor: 'var(--color)',
    height: 30,
    paddingLeft: 10,
    fontSize: 14,
  },
  sliderLabel: {
    fontSize: 14,
  }
})

interface IMemorySliderProps {
  $progress: number
  $progressColor: string
  $progressText?: string
  $otherProgressColor: string
  $otherProgressText?: string
  $label: string
}

export default function MemorySlider(props: IMemorySliderProps) {
  return (
    <section>
      <span {...stylex.attrs(style.sliderLabel)}>{props.$label}</span>
      <Flex {...stylex.attrs(style.slider)}>
        <FlexCenterY style={{
          '--progress': `${props.$progress}%`,
          '--color': `${props.$progressColor}`,
        }} {...stylex.attrs(style.sliderProgress)}>
          {props.$progressText}
        </FlexCenterY>
        <FlexCenterY style={{
          '--progress': `${100 - props.$progress}%`,
          '--color': `${props.$otherProgressColor}`,
        }} {...stylex.attrs(style.sliderProgress)}>
          {props.$otherProgressText}
        </FlexCenterY>
      </Flex>
    </section>
  )
}