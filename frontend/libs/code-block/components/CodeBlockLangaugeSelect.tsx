import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components"
import { LANGUAGE_MAPPING, type LanguageName } from "../provider"

interface ICodeBlockLanguageSelectProps {
  value$?: LanguageName
  onChange$?(value: LanguageName): any
}

export function CodeBlockLanguageSelect(props: ICodeBlockLanguageSelectProps) {
  return (
    <Select
      value={props.value$ ?? "text"}
      onChange={props.onChange$ as any}
      options={Object.keys(LANGUAGE_MAPPING)}
      placeholder="Select language"
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          {props.item.rawValue}
        </SelectItem>
      )}
    >
      <SelectTrigger aria-label="Fruit" class="w-[180px]">
        <SelectValue<string>>
          {(state) => state.selectedOption()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  )
}