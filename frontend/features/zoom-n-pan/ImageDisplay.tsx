import stylex from "@stylexjs/stylex"
import { useZoomAndPanContext } from "./ZoomAndPanProvider"
import { FlexCenter } from "~/components"
import { mergeClassname } from "~/utils"
import { imgZoomPanLog } from "../debug"

const style = stylex.create({
  imageDisplay: {
    width: '100%',
    height: '100%',
    // positon: 'relative',
    overflow: 'hidden'
  },
  wrapRoot: {
    width: '100%',
    height: '100%',
  },
  imageWrap: {
    width: 'fit-content',
    // position: 'absolute',
    transition: 'scale 0.25s cubic-bezier(0.17, 0.67, 0.11, 0.95)',
    scale: 'var(--image-scale)',
  },
  image: {
    userDrag: 'none',
    userSelect: 'none'
  },
  limitImgHeight: {
    maxHeight: "100vh"
  },
  scrollContainer: {
    width: '100%',
    height: '100%',
    overflow: 'scroll'
  },
  grabCursor: {
    cursor: 'grab'
  }
})

export function ImageDisplay() {
  const { internal$ } = useZoomAndPanContext()

  const [imagePosition, setImagePosition] = internal$.imagePosition$

  // Adapted from https://www.w3schools.com/howto/howto_js_draggable.asp
  // slightly modified from https://gist.github.com/stephanbogner/75de4e84687ae6065fb0a4d81917543e
  let targetElement!: Ref<"div">
  let draggableRef!: Ref<"div">
  let imgRef!: Ref<"img">

  let dragStartMouseX = 0, dragStartMouseY = 0, diffX = 0, diffY = 0, positionX = 0, positionY = 0
  const dragStart = (e: MouseEvent) => {
    if (internal$.zoomScale$() <= 1) {
      return // don't do the dragging stuff
    }

    e.preventDefault()

    dragStartMouseX = e.clientX
    dragStartMouseY = e.clientY
    listenOnMouseDrag()
  }

  const dragMove = (e: MouseEvent) => {
    e.preventDefault()

    let currentMouseX = e.clientX
    let currentMouseY = e.clientY

    diffX = dragStartMouseX - currentMouseX
    diffY = dragStartMouseY - currentMouseY
    
    let newX = positionX - diffX
    let newY = positionY - diffY

    // complex image bound checking stuff to make sure the image 
    // is not being dragged out of the page
    // 
    // note: this bound check is not really complete
    if (newX > imgRef.width / 2 || newX < imgRef.width / 2 * -1) {
      return setImagePosition(prev => ({
        ...prev,
        y: newY
      }))
    }

    if (newY > imgRef.height / 2 || newY < imgRef.height / 2 * -1) {
      return setImagePosition(prev => ({
        ...prev,
        x: newX
      }))
    }

    setImagePosition({
      x: newX,
      y: newY
    })
  }

  const dragStop = () => {
    positionX -= diffX
    positionY -= diffY
    cleanUpOnMouseReleases()
  }

  const listenOnMouseDrag = () => {
    document.onmouseup = dragStop
    document.onmousemove = dragMove
    imgZoomPanLog.log("attach mouse eventlistener")
  }
  
  const cleanUpOnMouseReleases = () => {
    document.onmouseup = null
    document.onmousemove = null
    imgZoomPanLog.log("cleaned up listeners")
  }

  return (
    <FlexCenter 
      {...stylex.attrs(style.imageDisplay)} 
      onMouseDown={dragStart}
      ref={targetElement}
    >
      <div
        class={mergeClassname(
          stylex.attrs(
            style.imageWrap, 
            internal$.zoomScale$() > 1 ? style.grabCursor : {},
          )
        )}
        style={{
          '--image-scale': internal$.zoomScale$(),
          'transform': `translate(${imagePosition().x}px, ${imagePosition().y}px)`,
        }}
        ref={draggableRef}
      >
        <img
          {...stylex.attrs(style.image, internal$.zoomScale$() <= 1 ? style.limitImgHeight : {})}
          draggable={false}
          src={internal$.displayImageUrl$()}
          ref={imgRef}
        />
      </div>
    </FlexCenter>
  )
}