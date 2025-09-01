import { Button, Tooltip } from "~/components"
import { type IGalleryContext, useGalleryContext } from "../../provider"
import { BsArrowLeft, BsArrowRight } from "solid-icons/bs"

interface INextAndPrevButtons {
  context$?: IGalleryContext
}

export function NextAndPrevButtons(props: INextAndPrevButtons) {
  const { next$, previous$ } = useGalleryContext() ?? props.context$

  return (
    <>
      <Tooltip label$="Go back">
        <Button
          size$={ButtonSize.ICON}
          onClick={previous$}
        >
          <BsArrowLeft />
        </Button>
      </Tooltip>
      <Tooltip label$="Go next">
        <Button
          size$={ButtonSize.ICON}
          onClick={next$}
        >
          <BsArrowRight />
        </Button>
      </Tooltip>
    </>
  )
}