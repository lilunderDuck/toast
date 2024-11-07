import stylex from "@stylexjs/stylex"
import { Show } from "solid-js"
// ...
import { FlexCenterX, Spacer } from "~/components"
import { useJournalContext } from "../../context"
// import { Show } from "solid-js"

const style = stylex.create({
  groupName: {
    backgroundColor: 'var(--gray3)',
    border: '1px solid var(--gray6)',
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 20,
    paddingBlock: 2,
    width: '45%',
    height: 'calc(var(--window-titlebar-width) - 7px)',
    WebkitAppRegion: 'no-drag',
    fontSize: 12,
    textAlign: 'center',
    gap: 5
  },
  color: {
    color: 'var(--gray10)',
  }
})

export default function GroupName() {
  const { $currentlyOpenedJournal, $currentGroup } = useJournalContext()
  const [currentGroup] = $currentGroup

  return (
    <>
      <Spacer />
      <FlexCenterX {...stylex.attrs(style.groupName)}>
        <span {...stylex.attrs(style.color)}>
          {currentGroup()?.name}
        </span>
        <Show when={$currentlyOpenedJournal()}>
          /
          <span>
            {$currentlyOpenedJournal()}
          </span>
        </Show>
      </FlexCenterX>
      <Spacer />
    </>
  )
}