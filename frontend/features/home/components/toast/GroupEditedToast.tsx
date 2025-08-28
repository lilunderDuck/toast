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

interface IGroupEditedToastProps extends Toast {
  name$: string
}

export function GroupEditedToast(props: IGroupEditedToastProps) {
  return (
    <div class={mergeClassname(
      stylex.attrs(style.toast),
      props.visible ? animations.fadeAndZoomIn : animations.fadeAndZoomOut
    )}>
      <div {...stylex.attrs(style.toast__title)}>
        <BsCheck2Square />
        <h4>Journal group edited</h4>
      </div>
      <div {...stylex.attrs(style.toast__description)}>
        Successfully updated <code>{props.name$}</code>
      </div>
    </div>
  )
}