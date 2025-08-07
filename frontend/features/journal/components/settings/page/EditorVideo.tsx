import { createSignal } from "solid-js"
// ...
import { CheckboxSettingSection, CustomSettingSection, RangeSettingSection, SubSetting } from "~/features/setting"
// import { Video } from "~/features/editor/extensions/video"
// ...
import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"

const style = stylex.create({
  subSetting: {
    paddingLeft: 15,
    paddingBlock: 5,
    marginTop: 5,
    borderLeft: "2px solid var(--gray10)"
  },
  videoIndicatorPreview: {
    marginTop: 5,
    height: "10rem",
    backgroundColor: "var(--gray6)",
    position: "relative"
  }
})

export default function EditorVideo() {
  const [isAntiEarrpageEnabled, setIsAntiEarrapeEnabled] = createSignal(true)

  const volumeOptions = [0, 25, 50, 75, 100].map(it => ({ name$: `${it}%`, value$: it }))
  const delayOptions = new Array(10).fill(0).map((_, index) => ({ name$: `${index + 1}s`, value$: index + 1 }))

  console.log(delayOptions, delayOptions)
  return (
    <>
      <CheckboxSettingSection 
        name$="Show pause indicator."
        description$="Show this little thing on the bottom-center of the video (while the video is in fullscreen)"
      />
      <div {...stylex.attrs(style.videoIndicatorPreview, shorthands.w_full$, shorthands.flex_center$)}>
        {/* <VideoPausedIndicator /> */}
      </div>

      <CheckboxSettingSection
        name$="Gradually increase/decrease volume when play/pause video."
        description$="Prevent you being earraped. For headphone user when you paused for a while, and then you play the video again."
        onChange$={(isEnabled) => setIsAntiEarrapeEnabled(isEnabled)}
      />
      <SubSetting>
        <RangeSettingSection
          name$="Should activate above"
          options$={{ min: 0, max: 100, step: 25 }}
          markerValue$={volumeOptions}
          disabled$={!isAntiEarrpageEnabled()}
          description$={"If the volume is above the specified volume, this \"anti-earrape\" will kick in."}
        />

        <RangeSettingSection
          name$="Delay"
          options$={{ min: 1, max: 10, step: 1 }}
          markerValue$={delayOptions}
          disabled$={!isAntiEarrpageEnabled()}
          description$="Change how long it should take to increase/decrease the volume"
        />
      </SubSetting>

      <CustomSettingSection
        name$="Testing section for lazies."
        description$="A little preview for you, because going in and out of setting page does talking some times"
      >
        {/* <Video path={testVideo} /> */}
      </CustomSettingSection>
    </>
  )
}