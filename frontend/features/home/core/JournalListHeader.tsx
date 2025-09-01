import stylex from "@stylexjs/stylex"
import { BsGearFill } from "solid-icons/bs"
import { Button, createLazyLoadedDropdownMenu } from "~/components"

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
  const Dropdown = createLazyLoadedDropdownMenu(
    () => import("./JournalListHeaderDropdown")
  )

  return (
    <div {...stylex.attrs(style.header)}>
      <h1>{props.name$}</h1>
      <Dropdown.DropdownMenu$>
        <Button size$={ButtonSize.ICON}>
          <BsGearFill />
        </Button>
      </Dropdown.DropdownMenu$>
    </div>
  )
}