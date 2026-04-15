import stylex from "@stylexjs/stylex"

const style = stylex.create({
  header__seperator: {
    height: 14,
    width: 1,
    backgroundColor: "var(--overlay1)",
    marginInline: 2
  }
})

interface IPlaylistItemListHeaderSeperatorProps {
  class: string
}

export function PlaylistItemListHeaderSeperator(props: IPlaylistItemListHeaderSeperatorProps) {
  return (
    <div 
      class={`${stylex.attrs(style.header__seperator).class} ${props.class}`} 
    />
  )
}