import { Show } from "solid-js"
// ...
import "./NeoforgeProgressBar.css"
import { css } from "molcss"

const progressBar = css`
  width: 50%;
  flex-shrink: 0;
  overflow: hidden;
`

const progressBar__wrap = css`
  border: 3px solid #ffffff;
  width: 100%;
  height: 20px;
  padding: 2px;
`

const progressBar__progress = css`
  width: var(--progress-bar-current-progress);
  height: -webkit-fill-available;
  background-color: #ffffff;
  transition: width 0.2s ease-out;
`

const progressBar__progressInfiniteWrap = css`
  position: relative;
`

const progressBar__progressInfinite = css`
  position: absolute;
  width: 20;
  height: calc(100% - 4px);
  background-color: #ffffff;
`

const progressBar__label = css`
  margin-bottom: 2px;
`

export interface INeoforgeProgressBarProps {
  currentProgress$?: number
  label$?: string
  isInfiniteLoading$?: boolean
}

export function NeoforgeProgressBar(props: INeoforgeProgressBarProps) {
  return (
    <div class={progressBar}>
      <Show when={props.label$}>
        <div class={progressBar__label}>
          {props.label$}
        </div>
      </Show>
      <Show when={props.isInfiniteLoading$} fallback={
        <div class={progressBar__wrap}>
          <div class={progressBar__progress} style={`--progress-bar-current-progress:${props.currentProgress$}%`} />
        </div>
      }>
        <div class={`${progressBar__wrap} ${progressBar__progressInfiniteWrap}`}>
          <div 
            class={progressBar__progressInfinite} 
            id="progressBar__infinite" 
          />
        </div>
      </Show>
    </div>
  )
}