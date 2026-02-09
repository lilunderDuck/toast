import stylex from "@stylexjs/stylex"

const style = stylex.create({
  everything: {
    paddingInline: 10,
    paddingTop: 10,
    paddingBottom: 20
  }
})

interface IAttributeEditorProps {
  // 
}

export function AttributeEditor(props: IAttributeEditorProps) {
  return (
    <div {...stylex.attrs(style.everything)}></div>
  )
}