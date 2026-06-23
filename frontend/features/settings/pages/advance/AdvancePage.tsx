import { Button } from "~/components";
import { CheckboxSettingSection, CustomSettingSection } from "../../components";

export function AdvancePage() {
  return (
    <>
      <CustomSettingSection
        name$="Open dev tools"
        description$="Open deverloper tools (if you want to mess around)"
      >
        <Button size$={ButtonSize.SMALL}>
          Open
        </Button>
      </CustomSettingSection>
    </>
  )
}