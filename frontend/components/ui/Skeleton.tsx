import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { SkeletonRootProps } from "@kobalte/core/skeleton"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
// ... 
import { css } from "molcss"
import "./Skeleton.css"

const spookySkeleton = css`
  animation: skeleton__pulseAnimation 2s cubic-bezier(.4,0,.6,1) infinite;
  background-color: var(--surface0);
  border-radius: 6px;
`

export interface ISkeletonRootProps<T extends ValidComponent = "div"> extends SkeletonRootProps<T> {
  class?: string | undefined
}
 
export function Skeleton<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ISkeletonRootProps<T>>
) {
  const [local, others] = splitProps(props as ISkeletonRootProps, ["class"])
  return (
    <div
      class={`${spookySkeleton} ${local.class ?? ""}`}
      {...others}
    />
  )
}