import stylex from "@stylexjs/stylex"
// ...
import { FlexCenter } from "~/components"

const style = stylex.create({
  page: {
    width: "100%",
    height: "100%"
  }
})

interface IWelcomePageProps {
  // define your component props here
}

export function WelcomePage(props: IWelcomePageProps) {
  return (
    <FlexCenter {...stylex.attrs(style.page)}>
      <div>
        <h3>Welcome, home</h3>
        <span>Nothing here, try open your journal or create a new one.</span>
      </div>
    </FlexCenter>
  )
}