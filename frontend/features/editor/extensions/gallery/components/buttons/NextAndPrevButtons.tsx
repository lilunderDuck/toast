import { Button, Tooltip } from "~/components"
import { type IGalleryContext, useGalleryContext } from "../../provider"
import { BsArrowLeft, BsArrowRight } from "solid-icons/bs"

interface INextAndPrevButtons {
  context$?: IGalleryContext
}

export function NextAndPrevButtons(props: INextAndPrevButtons) {
  const { next$, previous$, currentIndex$, data$ } = useGalleryContext() ?? props.context$

  return (
    <>
      <Tooltip label$="Go back">
        <Button
          size$={ButtonSize.ICON}
          onClick={previous$}
          disabled={currentIndex$() === 0}
        >
          <BsArrowLeft />
        </Button>
      </Tooltip>
      <Tooltip label$="Go next">
        <Button
          size$={ButtonSize.ICON}
          onClick={next$}
          disabled={currentIndex$() === data$()?.items?.length - 1}
        >
          <BsArrowRight />
        </Button>
      </Tooltip>
    </>
  )
}