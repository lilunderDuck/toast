import "./FourDotsSpinningLoader.css"
import { css } from "molcss"

// https://uiverse.io/SchawnnahJ/tough-baboon-87
const loader = css`
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  transform: rotate(165deg);
  &::before {
    animation: loader__beforeAnimation 2s infinite;
  }

  &::after {
    animation: loader__afterAnimation 2s infinite;
  }

  &::before, &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 0.25em;
    transform: translate(-50%, -50%);
  }
`

interface IFourDotsSpinningLoaderProps {
  // ...
}

export function FourDotsSpinningLoader(props: IFourDotsSpinningLoaderProps) {
  return (
    <div class={loader} />
  )
}