import {
  BsKeyboardFill,
  BsLayoutSidebarInset,
  BsLayoutSidebarReverse,
  BsLayoutTextWindowReverse,
  BsLayoutWtf,
} from "solid-icons/bs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Kbd,
} from "~/components"
import { SmallIconButton } from "./icon/IconButton"
import { createSignal, lazy } from "solid-js"
import DropdownItem from "./DropdownItem"
// import { toggleShowSidebar } from "../../utils"

const KeyboardMapDialog = lazy(() => import('./keyboard-map'))

export default function CustomizeLayoutButton() {
  const [showKeyboardDialog, setShowKeyboardDialog] = createSignal(false)

  const openKeyboardDialog = () => {
    setShowKeyboardDialog(false)
    setShowKeyboardDialog(true)
  }

  return (
    <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger as="div" editor-tour-customize-layout-button>
        <SmallIconButton $icon={BsLayoutWtf} $size={13} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Customize layout...</DropdownMenuLabel>
        <DropdownItem 
          $icon={BsLayoutSidebarInset}
          $name='Toggle sidebar'
          $shortcut={<>
            <Kbd>C</Kbd> <Kbd>A</Kbd>
          </>}
          onClick={undefined}
        />

        <DropdownItem 
          $icon={BsLayoutTextWindowReverse} 
          $name='Toggle status bar'
          $shortcut={<>
            <Kbd>C</Kbd> <Kbd>B</Kbd>
          </>} 
        />

        <DropdownItem 
          $icon={BsLayoutSidebarReverse} 
          $name='Show journal content breakdown'
          $shortcut={<>
            <Kbd>C</Kbd> <Kbd>C</Kbd>
          </>} 
        />

        <DropdownMenuLabel>Others</DropdownMenuLabel>
        <DropdownItem 
          $icon={BsKeyboardFill} 
          $name='Show keyboard shortcuts'
          onClick={openKeyboardDialog}
        />
      </DropdownMenuContent>

      {showKeyboardDialog() && <KeyboardMapDialog />}
    </DropdownMenu>
  );
}

