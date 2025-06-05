import stylex from "@stylexjs/stylex"
import { BsPlus } from "solid-icons/bs"
import { Show, splitProps } from "solid-js"
import { FlexCenter, SpinningCube } from "~/components"

const style = stylex.create({
  input_fixedHeight: {
    height: '18rem'
  },
  input_autoHeight: {
    height: 'auto'
  },
  input_imageInput: {
    height: '100%',
    width: '100%',
  },
  input_imageEmpty: {
    height: '100%',
    width: '100%',
  },
  input_loading: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--gray5)',
    opacity: 0.7,
    position: 'absolute',
    top: 0,
  }
})

interface IImageInputProps extends HTMLAttributes<"img"> {
  imageSrc$?: string
  isLoading$: boolean
}

export function ImageInputAndDropzone(props: IImageInputProps) {
  const [, itsProps] = splitProps(props, ["imageSrc$", "isLoading$"])

  return (
    <div 
      {...stylex.attrs(
        style.input_imageInput,
        props.imageSrc$ ? style.input_autoHeight : style.input_fixedHeight
      )}
    >
      <Show when={props.imageSrc$} fallback={
        <FlexCenter {...stylex.attrs(style.input_imageEmpty)}>
          <BsPlus />
        </FlexCenter>
      }>
        <img src={props.imageSrc$} {...itsProps} />
      </Show>
      <Show when={props.isLoading$}>
        <FlexCenter {...stylex.attrs(style.input_loading)}>
          <SpinningCube cubeSize$={36} />
        </FlexCenter>
      </Show>
    </div>
  )
}