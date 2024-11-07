import stylex from "@stylexjs/stylex"
import { BsFolderFill, BsJournalPlus } from "solid-icons/bs"
import { lazy, splitProps } from "solid-js"
import { IconTypes } from "solid-icons"
// ...
import { Button, ButtonSizeVariant, FlexCenterY, Spacer, Tooltip } from "~/components"
import { createLazyLoadedDialog } from "~/utils"
import { ThisEditor } from "~/features/editor"
// ...
import { EditOrReadonlyIcon } from "../../shared"
import { useJournalContext } from "../../context"

const CreateJournalModal = lazy(() => import('./create-stuff/CreateJournalModal'))

const style = stylex.create({
  buttonsRow: {
    gap: 10
  },
  button: {
    flexShrink: 0
  }
})

interface IButtonItemProps extends HTMLAttributes<"button"> {
  $icon: IconTypes
  $label: string
}

export function SidebarButtonsRow() {
  const { $currentlyOpenedJournal } = useJournalContext()
  const toggleEditOrReadonlyMode = () => {
    ThisEditor.$setEditable(prev => !prev)
  }

  const ButtonItem = (props: IButtonItemProps) => {
    const [, buttonProps] = splitProps(props, ["$icon", "$label"])
    return (
      <Tooltip $label={props.$label}>
        <Button 
          {...buttonProps}
          $size={ButtonSizeVariant.icon} 
          {...stylex.attrs(style.button)}
        >
          <props.$icon />
        </Button>
      </Tooltip>
    )
  }

  const createJournalModal = createLazyLoadedDialog()

  return (
    <FlexCenterY {...stylex.attrs(style.buttonsRow)}>
      <ButtonItem 
        editor-tour-create-journal-button
        onClick={createJournalModal.$show}
        $icon={BsJournalPlus}
        $label={'New journal'}
      />
      <ButtonItem
        editor-tour-create-journal-category-button
        $icon={BsFolderFill}
        $label={'New category'}
      />
      <Spacer />
      <ButtonItem 
        rough-toggle-edit-or-readonly-button
        editor-tour-toggle-edit-or-readonly-button
        onClick={toggleEditOrReadonlyMode}
        disabled={!$currentlyOpenedJournal()}
        $icon={EditOrReadonlyIcon}
        $label={`Toggle ${ThisEditor.$isEditable() ? 'read-only' : 'edit'} mode`}
      />
      {/* ... */}
      <createJournalModal.$Modal>
        <CreateJournalModal $close={createJournalModal.$close} />
      </createJournalModal.$Modal>
    </FlexCenterY>
  )
}