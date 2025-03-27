import stylex from "@stylexjs/stylex"

const PROGRESS_BAR_HEIGHT = 5

const style = stylex.create({
  progress: {
    width: '100%',
    // backgroundColor: 'var(--gray9)',
    // height: PROGRESS_BAR_HEIGHT,
    // borderRadius: 5,
    // position: 'relative'
  },
  progressIndiciator: {
    width: 'var(--progress)',
    height: PROGRESS_BAR_HEIGHT,
    backgroundColor: '#037bfc',
    borderRadius: 5
  },
  slider: {
    width: '100%',
    border: 'none',
    display: 'block',
    outline: 'none'
  }
})

interface IVideoProgressSliderProps {
  progress$: number
  onChange$(value: number): void
}

export default function VideoProgressSlider(props: IVideoProgressSliderProps) {
  return (
    <div {...stylex.attrs(style.progress)}>
      <input 
        type="range"
        min={0}
        max={100}
        step={0.0001}
        value={props.progress$}
        onChange={(value) => props.onChange$(parseFloat(value.currentTarget.value))}
        {...stylex.attrs(style.slider)}
      />
      {/* <div {...stylex.attrs(style.progressIndiciator)} /> */}
    </div>
  )
}