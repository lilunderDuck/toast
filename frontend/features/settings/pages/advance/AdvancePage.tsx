import { Button } from "~/components"
// ...
import { CustomSettingSection } from "../../components"

export function AdvancePage() {
  return (
    <>
      <CustomSettingSection
        name$="Open dev tools"
        description$="Open deverloper tools (if you want to mess around)"
      >
        <Button>
          Open
        </Button>
      </CustomSettingSection>
    </>
  )
}