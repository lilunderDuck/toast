import stylex from "@stylexjs/stylex"
import { mergeClassname } from "../../utils"
import { Dynamic } from "solid-js/web"
import { splitProps } from "solid-js"

const style = stylex.create({
  $flex: {
    display: 'flex'
  },
  $flexCenterX: {
    justifyContent: 'center',
  },
  $flexCenterY: {
    alignItems: 'center',
  },
  $spacer: {
    flex: '1 1 0%',
    placeSelf: 'stretch'
  }
})

type FlexType = 
  0 |  // flex only
  1 |  // center X
  2 |  // center Y
  3    // center both X and Y
// 

const createFlex = (type: FlexType) => {
  const mapping = {
    0: stylex.attrs(style.$flex),
    1: stylex.attrs(style.$flex, style.$flexCenterX),
    2: stylex.attrs(style.$flex, style.$flexCenterY),
    3: stylex.attrs(style.$flex, style.$flexCenterX, style.$flexCenterY),
  }

  return <T extends keyof HTMLElementTagNameMap>(props: HTMLAttributes<T> & {
    as$?: T
  }) => {
    const [, itsProps] = splitProps(props, ["as$"])

    return (
      // @ts-ignore too lazy!
      <Dynamic component={props.as$ ?? "div"} {...itsProps} class={mergeClassname(props, mapping[type])} />
    )
  }
}

export const Flex = createFlex(0)
export const FlexCenterX = createFlex(1)
export const FlexCenterY = createFlex(2)
export const FlexCenter = createFlex(3)

export function Spacer(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={mergeClassname(
      props,
      stylex.attrs(style.$spacer)
    )} />
  )
}