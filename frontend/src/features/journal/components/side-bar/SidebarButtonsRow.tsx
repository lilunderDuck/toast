import stylex from "@stylexjs/stylex"
import { BsPlus } from "solid-icons/bs"
import { lazy, splitProps } from "solid-js"
import { IconTypes } from "solid-icons"
// ...
import { 
  Button, 
  ButtonSizeVariant, 
  createLazyLoadedDialog, 
  FlexCenterY, 
  Spacer, 
  Tooltip 
} from "~/components"
import { EditOrReadonlyIcon, useEditorContext } from "~/features/editor"
// ...
import { useJournalContext } from "../../context"

const style = stylex.create({
  buttonsRow: {
    gap: 10
  },
  button: {
    flexShrink: 0,
    // forced to be this way
    backgroundColor: 'var(--gray1) !important',
    color: 'var(--gray11)',
    ':hover': {
      backgroundColor: 'var(--gray4) !important',
      color: 'var(--gray12)'
    }
  }
})

interface IButtonItemProps extends HTMLAttributes<"button"> {
  icon$: IconTypes
  label$: string
}

export function SidebarButtonsRow() {
  const { journal$ } = useJournalContext()
  const { isReadonly$, setIsReadonly$ } = useEditorContext()
  const toggleEditOrReadonlyMode = () => {
    setIsReadonly$(prev => !prev)
  }

  const createStuffModal = createLazyLoadedDialog(
    lazy(() => import('./CreateStuffModal'))
  )

  const mode = () => isReadonly$() ? 'read-only' : 'edit'

  return (
    <FlexCenterY {...stylex.attrs(style.buttonsRow)}>
      <ButtonItem 
        onClick={createStuffModal.show$}
        icon$={BsPlus}
        label$='New journal'
      />
      <Spacer />
      <ButtonItem 
        onClick={toggleEditOrReadonlyMode}
        disabled={!journal$.currentlyOpened$()}
        icon$={EditOrReadonlyIcon}
        label$={`Toggle ${mode()} mode`}
      />
      {/* ... */}
      <createStuffModal.Modal$ />
    </FlexCenterY>
  )
}

function ButtonItem(props: IButtonItemProps) {
  const [, buttonProps] = splitProps(props, ["icon$", "label$"])
  return (
    <Tooltip label$={props.label$}>
      <Button 
        {...buttonProps}
        size$={ButtonSizeVariant.icon} 
        {...stylex.attrs(style.button)}
      >
        <props.icon$ />
      </Button>
    </Tooltip>
  )
}