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

const enum FlexType {
  flexOnly,
  flexCenterX,
  flexCenterY,
  flexCenter
}

function createFlex(type: FlexType) {
  const mapping = {
    [FlexType.flexOnly]: stylex.attrs(style.$flex),
    [FlexType.flexCenterX]: stylex.attrs(style.$flex, style.$flexCenterX),
    [FlexType.flexCenterY]: stylex.attrs(style.$flex, style.$flexCenterY),
    [FlexType.flexCenter]: stylex.attrs(style.$flex, style.$flexCenterX, style.$flexCenterY),
  }

  return <T extends keyof HTMLElementTagNameMap>(props: HTMLAttributes<T> & {
    as$?: T
  }) => {
    const [, itsProps] = splitProps(props, ["as$"])

    return (
      // @ts-ignore - nah I'm definitely not gonna fix this type error.
      <Dynamic component={props.as$ ?? "div"} {...itsProps} class={mergeClassname(props, mapping[type])} />
    )
  }
}

export const Flex = createFlex(FlexType.flexOnly)
export const FlexCenterX = createFlex(FlexType.flexCenterX)
export const FlexCenterY = createFlex(FlexType.flexCenterY)
export const FlexCenter = createFlex(FlexType.flexCenter)

export function Spacer(props: HTMLAttributes<"div">) {
  return (
    <div {...props} class={mergeClassname(
      props,
      stylex.attrs(style.$spacer)
    )} />
  )
}