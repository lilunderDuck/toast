import stylex from "@stylexjs/stylex"
import { SpinningCube } from "~/components"

const style = stylex.create({
  loading: {
    width: "100%",
    height: "10rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

interface ITableLoadingProps {
  // ...
}

export function TableLoading(props: ITableLoadingProps) {
  return (
    <div {...stylex.attrs(style.loading)}>
      <SpinningCube cubeSize$={20} />
    </div>
  )
}