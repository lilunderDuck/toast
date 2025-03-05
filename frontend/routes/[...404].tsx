import { useNavigate } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonSizeVariant, Flex, FlexCenter } from "~/components"
import { getRandomElement } from "~/utils"
import { duck_uhhh } from "~/features/technical/assets"

const style = stylex.create({
  thisThing: {
    width: '100%',
    height: '100%',
    userSelect: 'none'
  },
  image: {
    background: 'center center no-repeat var(--bg)',
    backgroundSize: 'contain',
    width: '12rem',
    height: '12rem',
  },
  buttonRows: {
    gap: 15,
    marginTop: 10
  }
})

export default function PageNotFound() {
  const goTo = useNavigate()
  const heading = getRandomElement([
    'Whoops, nothing here!',
    'Aww come on!',
    'Uhhh-',
    '*Page disappeared*',
    'Where did it go??'
  ])

  return (
    <FlexCenter {...stylex.attrs(style.thisThing)}>
      <div {...stylex.attrs(style.image)} style={{
        '--bg': `url('${duck_uhhh}')`
      }} />
      <div>
        <h3>{heading}</h3>
        <div>So... *somehow*, you have landed to a <a href="https://http.cat/status/404" target="_blank">404</a> page.</div>
        <br />
        <div>Don't be scared... (although this is kinda awkward)</div>
        <div>There is a way to get home though.</div>
        <br />
        You want to go home?
        <Flex {...stylex.attrs(style.buttonRows)}>
          <Button size$={ButtonSizeVariant.sm} onClick={() => goTo('/')}>
            Lemme outta here!!
          </Button>
        </Flex>
      </div>
    </FlexCenter>
  )
}