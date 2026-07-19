import { AiOutlineCheckSquare } from "solid-icons/ai";
import { Button, Tooltip } from "~/components";
import type { IActionHandler } from "~/utils";

interface ICollectionExternalSectionButtonRowProps extends IActionHandler<CollectionExternalSectionAction> {
  // define your component props here
}

export function CollectionExternalSectionButtonRow(props: ICollectionExternalSectionButtonRowProps) {
  return (
    <>
      <Tooltip label$="Check for availability">
        <Button 
          size$={ButtonSize.ICON}
          variant$={ButtonVariant.NO_BACKGROUND}
          onClick={() => props.action$(CollectionExternalSectionAction.CHECK_FOR_AVAILABILITY)}
        >
          <AiOutlineCheckSquare />
        </Button>
      </Tooltip>
    </>
  )
}