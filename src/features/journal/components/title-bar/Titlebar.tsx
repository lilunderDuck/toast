import stylex from "@stylexjs/stylex"
import { useNavigate } from "@solidjs/router"
import { BsHouseDoorFill } from "solid-icons/bs"
// ...
import { FlexCenterY, Tooltip } from "~/components"
// ...
import CustomizeLayoutIcon from "./CustomizeLayoutButton"
import { SmallIconButton } from "./icon/IconButton"
import { toast } from "~/libs/toast"

const style = stylex.create({
  invisableButton: {
    visibility: 'hidden'
  },
  aLittleSpaces: {
    paddingInline: 5
  },
  $titleBar: {
    width: '100%',
    paddingLeft: 10,
    gap: 10,
    userSelect: 'none',
    height: 'var(--window-titlebar-width)',
    backgroundColor: 'var(--gray3)'
    // borderBottom: '1px solid var(--gray4)'
  },
})

export function TitleBar(props: HTMLAttributes<"div">) {
  const wait3Seconds = () => new Promise(r => setTimeout(r, 3000))
  const navigateTo = useNavigate()

  const clickHomeButton = () => {
    toast.promise(wait3Seconds(), {
      loading: 'Saving your journal...',
      success: 'Your stuff has been saved sucessfully',
      error: 'Something gone wrong'
    })

    navigateTo('/')
  }

  const InvsButton = () => <SmallIconButton {...stylex.attrs(style.invisableButton)} />
  const JustSomeSpaces = () => <div {...stylex.attrs(style.aLittleSpaces)} />

  return (
    <FlexCenterY {...props} {...stylex.attrs(style.$titleBar)}>
      <Tooltip $label={'Go back to home'}>
        <SmallIconButton editor-tour-home-button $icon={BsHouseDoorFill} $size={13} onClick={clickHomeButton} />
      </Tooltip>
      <InvsButton />

      <CustomizeLayoutIcon />
      <JustSomeSpaces />
    </FlexCenterY>
  )
}