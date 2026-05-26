import { CLS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  subSetting: {
    paddingLeft: 15,
    paddingBlock: 5,
    marginTop: 5,
    borderLeft: "2px solid var(--crust0)"
  },
})

export function SubSetting(props: HTMLAttributes<"div">) {
  return (
    <div 
      {...props}
      class={`${CLS(style.subSetting)} ${props.class ?? ""}`}
    />
  )
}