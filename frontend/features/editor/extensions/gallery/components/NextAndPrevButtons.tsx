import { Button } from "~/components"
import { IGalleryContext, useGalleryContext } from "../provider"
import { BsArrowLeft, BsArrowRight } from "solid-icons/bs"

interface INextAndPrevButtons {
  context$?: IGalleryContext
}

export function NextAndPrevButtons(props: INextAndPrevButtons) {
  const { next$, previous$ } = useGalleryContext() ?? props.context$

  return (
    <>
      <Button
        size$={ButtonSize.icon}
        onClick={previous$}
      >
        <BsArrowLeft />
      </Button>
      <Button
        size$={ButtonSize.icon}
        onClick={next$}
      >
        <BsArrowRight />
      </Button>
    </>
  )
}