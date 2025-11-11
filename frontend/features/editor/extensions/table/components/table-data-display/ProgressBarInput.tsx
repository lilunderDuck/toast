import stylex from "@stylexjs/stylex"
import { createSignal } from "solid-js"
import type { ITableDataTypeComponentProps } from "./TableDataItem"
import { isInRange } from "../../utils"

const style = stylex.create({
  progressBar: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    position: "relative"
  },
  progressBar__input: {
    width: "100%",
    appearance: "none",
    height: 15,
    background: "linear-gradient(90deg, var(--progress-bar-color) var(--progress), var(--gray5) var(--progress))",
    // change input slider color
    accentColor: "var(--progress-bar-color)",
    outline: "none",
    zIndex: 1,
    borderRadius: 6,
    marginRight: 34,
    "::-webkit-slider-thumb": {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: 12,
      height: 20,
      borderRadius: 6,
      background: 'var(--progress-bar-color)',
      boxShadow: 'none',
    }
  },
  progressBar__value: {
    position: "absolute",
    right: 0
  },
})

export default function ProgressBarInput(props: ITableDataTypeComponentProps<number>) {
  console.assert(
    typeof props.value$ === "number",
    "<ProgressBar /> value must be a number"
  )
  console.assert(
    isInRange(props.value$, 0, 100),
    "<ProgressBar /> value must be in a range of 0 to 100"
  )

  let inputRef!: Ref<"input">
  const [currentProgress, setCurrentProgress] = createSignal(props.value$ ?? 0)

  const getProgresColors = (progress: number) => {
    if (progress == 100) {
      return "#6eff5eff" // green-ish
    }

    return "var(--blue9)"
  }

  return (
    <div 
      {...stylex.attrs(style.progressBar)} 
      style={`--progress:${currentProgress()}%;--progress-bar-color:${getProgresColors(currentProgress())}`}
    >
      <input
        {...stylex.attrs(style.progressBar__input)}
        ref={inputRef}
        type="range"
        min={0}
        max={100}
        value={currentProgress()}
        onChange={(value) => {
          const newValue = parseInt(value.currentTarget.value)
          props.onChange$(newValue)
        }}
        onInput={(value) => {
          const newValue = parseInt(value.currentTarget.value)
          setCurrentProgress(newValue)
        }}
        step={1}
      />
      <span {...stylex.attrs(style.progressBar__value)}>
        {currentProgress()}
      </span>
    </div>
  )
}