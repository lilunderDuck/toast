import { Button, ButtonSizeVariant, DialogContent, Flex } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { useGalleryDataContext } from "../../data"
import GalleryFullViewList from "./GalleryFullViewList"
import GalleryButtonRow from "../GalleryButtonRow"
import { BsDash, BsPlus } from "solid-icons/bs"
import { createSignal } from "solid-js"

const style = stylex.create({
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent !important',
    overflowY: 'hidden',
    // paddingBlock: `10px !important`,
    willChange: 'transform',
    ':focus': {
      outline: 'none'
    },
  },
  innerContent: {
    width: '100%',
    height: '100%',
    paddingTop: 5,
  },
  galleryList: {
    backgroundColor: 'transparent !important'
  },
  buttonRow: {
    width: '100%',
    paddingBottom: 10
  },
  scaleText: {
    width: '3rem'
  }
})

export default function GalleryDialog() {
  const { galleryId$ } = useGalleryDataContext()
  const [scale, setScale] = createSignal(1)

  const ScaleButtonRow = () => (
    <>
      <Button size$={ButtonSizeVariant.icon} onClick={() => setScale(prev => prev - 0.25)}>
        <BsDash />
      </Button>
      <span {...stylex.attrs(style.scaleText)}>
        {scale()}x
      </span>
      <Button size$={ButtonSizeVariant.icon} onClick={() => setScale(prev => prev + 0.25)}>
        <BsPlus />
      </Button>
    </>
  )

  return (
    <DialogContent {...stylex.attrs(style.content)} id={`gallery-${galleryId$}`}>
      <div {...stylex.attrs(style.innerContent)}>
        <Flex {...stylex.attrs(style.buttonRow)}>
          <GalleryButtonRow>
            <ScaleButtonRow />
          </GalleryButtonRow>
        </Flex>
        <GalleryFullViewList scale$={scale()} />
      </div>
    </DialogContent>
  )
}