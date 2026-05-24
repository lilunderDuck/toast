import stylex from "@stylexjs/stylex";
import "./JournalHomeRoot.css"
import { JournalHomeRootProvider } from "../provider/JournalHomeRootProvider";
import type { ParentProps } from "solid-js";
import { SettingProvider } from "~/libs/setting-screen";

const style = stylex.create({
  home: {
    width: "100%",
    height: "100%",
    display: "flex"
  },
  home__titleBar: {
    position: "fixed",
    width: 0,
    top: 0
  }
})

export function JournalHomeRoot(props: ParentProps) {
  return (
    <SettingProvider<ISettingTest> 
      config$={[]} 
      data$={{
        something: 1
      }} 
      pages$={{
        "something": () => <></>
      }}
    >
      <JournalHomeRootProvider>
        <div {...stylex.attrs(style.home)}>
          {props.children}
        </div>
      </JournalHomeRootProvider>
    </SettingProvider>
  )
}