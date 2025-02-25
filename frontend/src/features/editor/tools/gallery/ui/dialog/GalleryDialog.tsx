import { Button, ButtonSizeVariant, DialogContent, Flex } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import GalleryFullViewList from "./GalleryFullViewList"
import GalleryButtonRow from "../GalleryButtonRow"
import { BsDash, BsPlus } from "solid-icons/bs"
import { createSignal, Match, Switch } from "solid-js"

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
  },
  scaleText: {
    minWidth: '3rem'
  }
})

export default function GalleryDialog() {
  const [scale, setScale] = createSignal(1)

  const ScaleButtonRow = () => (
    <>
      <Button size$={ButtonSizeVariant.icon} onClick={() => setScale(prev => prev - 0.25)}>
        <BsDash />
      </Button>
      <Button size$={ButtonSizeVariant.icon} onClick={() => setScale(prev => prev + 0.25)}>
        <BsPlus />
      </Button>
      <span {...stylex.attrs(style.scaleText)}>
        <Switch fallback={<>{scale()}x</>}>
          <Match when={scale() >= 5}>
            Absurdly large ({scale()}x)
          </Match>
          <Match when={scale() == 0}>
            *Vanished*
          </Match>
        </Switch>
      </span>
    </>
  )

  return (
    <DialogContent {...stylex.attrs(style.content)}>
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