import { BsPlus } from "solid-icons/bs"
// ...
import { FlexCenter, Input, Tooltip } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import { Show } from "solid-js"
import { createDropzone } from "@soorria/solid-dropzone"

const style = stylex.create({
  imageInput: {
    height: '15rem',
    width: '100%',
    marginBottom: 10
  },
  imageEmpty: {
    height: '15rem',
    width: '100%',
  }
})

export function ImageInput() {
  const dropzone = createDropzone({
    accept: ['.jpg', '.png'],
    maxFiles: 1,
    onDrop(acceptedFiles: File[]) {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        // setImagePreviewUrl(binaryStr as string)
      }

      console.log(acceptedFiles[0].name)

      reader.readAsDataURL(acceptedFiles[0])
    }
  })
  
  return (
    <div>
      <Tooltip label$="Click to choose an image">
        <div {...dropzone.}>
          <Show when={imagePreviewUrl$()} fallback={
            <FlexCenter {...stylex.attrs(style.imageEmpty)}>
              <BsPlus />
            </FlexCenter>
          }>
            <img src={imagePreviewUrl$()} />
          </Show>
        </div>
      </Tooltip>
      <Input placeholder="Optional description here" />
    </div>
  )
}