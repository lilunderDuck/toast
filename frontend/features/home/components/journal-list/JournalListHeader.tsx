import stylex from "@stylexjs/stylex"

const style = stylex.create({
  header: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 5,
    marginRight: "5rem"
  }
})

interface IJournalListHeaderProps {
  name$: string
}

export function JournalListHeader(props: IJournalListHeaderProps) {
  return (
    <div {...stylex.attrs(style.header)}>
      <h1>{props.name$}</h1>
    </div>
  )
}