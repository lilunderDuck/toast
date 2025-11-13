import { BsDisplayFill } from "solid-icons/bs"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  emptyView: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  emptyView__text: {
    fontSize: 14
  }
})

interface IGalleryItemEmptyProps {
  // define your component props here
}

export default function GalleryItemEmpty(props: IGalleryItemEmptyProps) {
  return (
    <div {...stylex.attrs(style.emptyView)}>
      <span>
        <BsDisplayFill size={30} />
      </span>
      <span {...stylex.attrs(style.emptyView__text)}>
        Nothing inside here...
      </span>
    </div>
  )
}