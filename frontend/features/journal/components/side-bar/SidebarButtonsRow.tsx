import stylex from "@stylexjs/stylex"
import { BsBookFill, BsPencilFill, BsPlus } from "solid-icons/bs"
import { Show, splitProps } from "solid-js"
import { IconTypes } from "solid-icons"
// ...
import { 
  Button, 
  ButtonSizeVariant, 
  createLazyLoadedDialog, 
  FlexCenterY, 
  Tooltip 
} from "~/components"
import { useEditorContext } from "~/features/editor"
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
    setIsReadonly$(!isReadonly$())
  }

  const createStuffModal = createLazyLoadedDialog(
    () => import('./modals/CreateStuffModal')
  )

  const mode = () => isReadonly$() ? 'read-only' : 'edit'

  return (
    <FlexCenterY {...stylex.attrs(style.buttonsRow)}>
      <ButtonItem 
        onClick={createStuffModal.show$}
        icon$={BsPlus}
        label$='New journal'
      />
      <ButtonItem 
        onClick={toggleEditOrReadonlyMode}
        disabled={!journal$.currentlyOpened$()}
        icon$={() => (
          <Show when={isReadonly$()} fallback={
            <BsBookFill size={15} />
          }>
            <BsPencilFill size={15} />
          </Show>
        )}
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