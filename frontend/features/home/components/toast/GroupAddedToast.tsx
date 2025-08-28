import stylex from "@stylexjs/stylex"
// ...
import { BsCheck2Square } from "solid-icons/bs"
import animations from "~/styles/animation.module.css"
// ...
import type { Toast } from "~/libs/solid-toast/util"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  toast: {
    backgroundColor: "var(--gray4)",
    paddingBlock: 5,
    paddingInline: 10,
    width: "18rem"
  },
  toast__title: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 5,
  },
  toast__description: {
    marginLeft: 25,
    fontSize: 13,
    color: "var(--gray11)"
  }
})

interface IGroupAddedToastProps extends Toast {
  name$: string
}

export function GroupAddedToast(props: IGroupAddedToastProps) {
  return (
    <div class={mergeClassname(
      stylex.attrs(style.toast),
      props.visible ? animations.fadeAndZoomIn : animations.fadeAndZoomOut
    )}>
      <div {...stylex.attrs(style.toast__title)}>
        <BsCheck2Square />
        <h4>Journal group added</h4>
      </div>
      <div {...stylex.attrs(style.toast__description)}>
        Added new group <code>{props.name$}</code>
      </div>
    </div>
  )
}