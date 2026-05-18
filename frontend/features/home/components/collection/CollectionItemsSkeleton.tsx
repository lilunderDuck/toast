import { Skeleton } from "~/components"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  skeleton: {
    width: "100%",
    height: "100%",
  }
})

export function CollectionItemsSkeleton() {
  return (
    <Skeleton {...stylex.attrs(style.skeleton)}></Skeleton>
  )
}