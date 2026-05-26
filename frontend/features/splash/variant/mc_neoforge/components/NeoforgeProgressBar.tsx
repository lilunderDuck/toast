import stylex from "@stylexjs/stylex"
import { CLS } from "macro-def";
import { Show } from "solid-js"
import "./NeoforgeProgressBar.css"

const style = stylex.create({
  progressBar: {
    width: "50%",
    flexShrink: 0,
    overflow: "hidden",
  },
  progressBar__wrap: {
    border: "3px solid #ffffff",
    width: "100%",
    height: 20,
    padding: 2,
  },
  progressBar__progress: {
    width: "var(--progress-bar-current-progress)",
    height: "-webkit-fill-available",
    backgroundColor: "#ffffff",
    transition: "width 0.2s ease-out"
  },
  progressBar__progressInfiniteWrap: {
    position: 'relative'
  },
  progressBar__progressInfinite: {
    position: "absolute",
    width: 20,
    height: "calc(100% - 4px)",
    backgroundColor: "#ffffff",
  },
  progressBar__label: {
    marginBottom: 2
  }
})

export interface INeoforgeProgressBarProps {
  currentProgress$?: number
  label$?: string
  isInfiniteLoading$?: boolean
}

export function NeoforgeProgressBar(props: INeoforgeProgressBarProps) {
  return (
    <div {...stylex.attrs(style.progressBar)}>
      <Show when={props.label$}>
        <div {...stylex.attrs(style.progressBar__label)}>
          {props.label$}
        </div>
      </Show>
      <Show when={props.isInfiniteLoading$} fallback={
        <div {...stylex.attrs(style.progressBar__wrap)}>
          <div {...stylex.attrs(style.progressBar__progress)} style={`--progress-bar-current-progress:${props.currentProgress$}%`} />
        </div>
      }>
        <div class={`${CLS(style.progressBar__wrap)} ${CLS(style.progressBar__progressInfiniteWrap)}`}>
          <div 
            {...stylex.attrs(style.progressBar__progressInfinite)} 
            id="progressBar__infinite" 
          />
        </div>
      </Show>
    </div>
  )
}