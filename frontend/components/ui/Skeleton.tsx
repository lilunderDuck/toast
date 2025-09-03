import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import stylex from "@stylexjs/stylex"
 
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { type SkeletonRootProps, Root } from "@kobalte/core/skeleton"
import { macro_mergeClassnames } from "macro-def"

const pulseAnimation = stylex.keyframes({
  '50%': {
    opacity: 0.5
  }
})

const style = stylex.create({
  spookySkeleton: {
    animation: `${pulseAnimation} 2s cubic-bezier(.4,0,.6,1) infinite`,
    backgroundColor: '#212123'
  }
})

export interface ISkeletonRootProps<T extends ValidComponent = "div"> extends SkeletonRootProps<T> {
  class?: string | undefined
}
 
export function Skeleton<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ISkeletonRootProps<T>>
) {
  const [local, others] = splitProps(props as ISkeletonRootProps, ["class"])
  return (
    <Root
      class={macro_mergeClassnames(stylex.attrs(style.spookySkeleton), local)}
      {...others}
    />
  )
}