import stylex from "@stylexjs/stylex"
import type { JSX } from "solid-js"
import __style from "./SpinningCube.module.css"
import { MERGE_CLASS } from "macro-def"

const spinningAnimation = stylex.keyframes({
  '0%': {
    transform: 'rotateX(-20deg) rotateY(20deg)'
  },
  '100%': {
    transform: 'rotateX(-20deg) rotateY(740deg)'
  }
})

const style = stylex.create({
  cubeBound: {
    width: 'var(--cube-size)',
    height: 'var(--cube-size)',
  },
  cube: {
    transformStyle: 'preserve-3d',
    animation: `${spinningAnimation} 3s linear infinite`,
    position: 'relative',
    top: '50%',
    left: '50%',
    marginLeft: 'var(--reverse-half-of-the-cube-size)',
    marginTop: 'var(--reverse-half-of-the-cube-size)',
  },
  cubeFace: {
    position: 'absolute',
  },
  top: {
    transform: 'rotateX(90deg)',
    marginTop: 'var(--reverse-half-of-the-cube-size)',
    backgroundColor: 'var(--top-face-color)'
  },
  right: {
    transform: 'rotateY(90deg)',
    marginLeft: 'var(--half-of-the-cube-size)',
    backgroundColor: 'var(--right-face-color)'
  },
  bottom: {
    transform: 'rotateX(-90deg)',
    marginTop: 'var(--half-of-the-cube-size)',
    backgroundColor: 'var(--bottom-face-color)'
  },
  left: {
    transform: 'rotateY(-90deg)',
    marginLeft: 'var(--reverse-half-of-the-cube-size)',
    backgroundColor: 'var(--left-face-color)'
  },
  front: {
    transform: `translateZ(var(--half-of-the-cube-size))`,
    backgroundColor: 'var(--front-face-color)'
  },
  back: {
    transform: `translateZ(var(--half-of-the-cube-size)) rotateX(180deg)`,
    backgroundColor: 'var(--back-face-color)'
  }
})

interface ISpinningCubeProps {
  /**The size of this cube in pixels. Default to `100px` */
  cubeSize$?: number
}

export function SpinningCube(props: ISpinningCubeProps) {
  const getCubeSize = () => props.cubeSize$ ?? 100

  return (
    <div 
      style={{ '--cube-size': `${getCubeSize()}px` }} 
      class={MERGE_CLASS(stylex.attrs(style.cubeBound), __style.thisCube)}
    >
      <div {...stylex.attrs(style.cube, style.cubeBound)}>
        <CubeFace {...stylex.attrs(style.top)} />
        <CubeFace {...stylex.attrs(style.right)} />
        <CubeFace {...stylex.attrs(style.bottom)} />
        <CubeFace {...stylex.attrs(style.left)} />
        <CubeFace {...stylex.attrs(style.front)} />
        <CubeFace {...stylex.attrs(style.back)} />
      </div>
    </div>
  )
}

function CubeFace(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div class={MERGE_CLASS(props, stylex.attrs(style.cubeFace, style.cubeBound))} />
  )
}