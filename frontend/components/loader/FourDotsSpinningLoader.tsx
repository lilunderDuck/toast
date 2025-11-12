import stylex from "@stylexjs/stylex"
import __style from "./FourDotsSpinningLoader.module.css"
const loader__beforeAnimation = stylex.keyframes({
  '0%': {
    width: '0.5em',
    boxShadow: '1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75)',
  },
  '35%': {
    width: '2.5em',
    boxShadow: '0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75)',
  },
  '70%': {
    width: '0.5em',
    boxShadow: '-1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75)',
  },
  '100%': {
    boxShadow: '1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75)',
  },
})

const loader__afterAnimation = stylex.keyframes({
  '0%': {
    height: '0.5em',
    boxShadow: '0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);',
  },
  '35%': {
    height: '2.5em',
    boxShadow: '0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75)',
  },
  '70%': {
    height: '0.5em',
    boxShadow: '0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75)',
  },
  '100%': {
    boxShadow: '0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75)',
  },
})

// https://uiverse.io/SchawnnahJ/tough-baboon-87
const style = stylex.create({
  loader: {
    position: "relative",
    width: "2.5rem",
    height: "2.5rem",
    transform: "rotate(165deg)",
    "::before": {
      animation: `${loader__beforeAnimation} 2s infinite`
    },
    "::after": {
      animation: `${loader__afterAnimation} 2s infinite`
    }
  }
})

interface IFourDotsSpinningLoaderProps {
  // ...
}

export function FourDotsSpinningLoader(props: IFourDotsSpinningLoaderProps) {
  return (
    <div {...stylex.attrs(style.loader)} id={__style.loader} />
  )
}