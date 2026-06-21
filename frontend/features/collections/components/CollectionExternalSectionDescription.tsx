import { css } from "molcss"
// ...
import { MdRoundWarning } from "solid-icons/md"

const collection__externalSourcesNoteWrap = css`
  padding-top: 15px;
`

const collection__externalSourcesNote = css`
  color: var(--peach);
  display: flex;
  align-items: center;
  gap: 5px;
`

export function CollectionExternalSectionDescription() {
  return (
    <>
      Collections opened outside the app will be saved here. 
      
      <p class={collection__externalSourcesNoteWrap}>
        <span class={collection__externalSourcesNote}>
          <MdRoundWarning />
          Note:
        </span> 
        If a collection is moved or renamed on your drive, 
        <br />
        you have to re-imported it.
      </p>
    </>
  )
}