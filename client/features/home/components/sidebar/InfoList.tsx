import stylex from "@stylexjs/stylex"
import { Show, type JSX } from "solid-js"
import { BsCalendar2Fill, BsJournalCheck, BsPencilFill } from "solid-icons/bs"
// ...
import { FlexCenterY } from "client/components"
import type { IJournalGroupData } from "client/api/journal"
// ...
import { SectionText } from "./Section"

const style = stylex.create({
  $name: {
    gap: 10
  },
  $infoList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(40%, 1fr))',
    gap: 15
  },
})

interface IInfoProps {
  $name: JSX.Element
  $description: JSX.Element
  $icon?: JSX.Element
}

function Info(props: IInfoProps) {
  return (
    <div>
      <FlexCenterY {...stylex.attrs(style.$name)} as$="h4">
        {props.$icon}
        <span>{props.$name}</span>
      </FlexCenterY>
      <SectionText>
        {props.$description}
      </SectionText>
    </div>
  )
}

export function InfoList(props: IJournalGroupData) {
  const formatDate = (date: Date) => new Intl.DateTimeFormat('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date))

  return (
    <div {...stylex.attrs(style.$infoList)}>
      <Info 
        $icon={<BsCalendar2Fill />}
        $name='Created'
        $description={formatDate(props?.created!)} 
      />
      <Info 
        $icon={<BsPencilFill />}
        $name='Last modified'
        $description={
          <Show when={props.modified} fallback={
            <span>You just created this</span>
          }>
            {formatDate(props?.modified!)}
          </Show>
        } 
      />
      <Info 
        $icon={<BsJournalCheck />}
        $name='Entries'
        $description={props?.entries ?? 0}
      />
    </div>
  )
}