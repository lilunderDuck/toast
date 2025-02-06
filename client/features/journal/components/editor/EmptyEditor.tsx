import { FlexCenter } from "~/components"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  empty: {
    flexFlow: 'column',
    width: '100%',
    height: '100%',
    userSelect: 'none'
  }
})

export default function EmptyEditor() {
  return (
    <FlexCenter {...stylex.attrs(style.empty)}>
      <h1>(O.o)?</h1>
      <div>There's nothing in here</div>
      <div>
        But there's 
        <a app-just-an-anchor rel="noreferrer noopener" onClick={() => {
          // ...
        }}>
          a button
        </a> to let you type though
      </div>
    </FlexCenter>
  )
}