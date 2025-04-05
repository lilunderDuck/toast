import { DialogContent, Flex, type IDialog } from "~/components"
import { ImageDisplay, useZoomAndPanContext, ZoomAndPanProvider, ZoomButtonRow } from "~/features/zoom-n-pan"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'

const style = stylex.create({
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent !important',
    overflowY: 'hidden',
    padding: `0 !important`,
    willChange: 'transform',
    ':focus': {
      outline: 'none'
    },
    position: 'relative'
  },
  innerContent: {
    width: '100%',
    height: '100%',
  },
  galleryList: {
    backgroundColor: 'transparent !important'
  },
  buttonRow: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    position: 'absolute',
    zIndex: 10
  }
})

interface IImageFullviewDialogProps extends IDialog {
  imageSrc$: string
}

export default function ImageFullviewDialog(props: IImageFullviewDialogProps) {
  const ChangeImageRightAway = () => {
    const { changeDisplayImage$ } = useZoomAndPanContext()
    changeDisplayImage$(props.imageSrc$)
    return undefined
  }

  return (
    <DialogContent {...stylex.attrs(style.content)}>
      <ZoomAndPanProvider>
        <ChangeImageRightAway />
        <Flex {...stylex.attrs(style.buttonRow)}>
          <ZoomButtonRow />
        </Flex>
        <ImageDisplay />
      </ZoomAndPanProvider>
    </DialogContent>
  )
}