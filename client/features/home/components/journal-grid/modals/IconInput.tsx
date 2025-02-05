import { createDropzone } from "@soorria/solid-dropzone"
import stylex from "@stylexjs/stylex"
import { BsFileImageFill } from "solid-icons/bs"
import { createSignal, Show } from "solid-js"
import { FlexCenter, FlexCenterX } from "client/components"

const style = stylex.create({
  $iconInput: {
    width: '16rem',
    height: '16rem',
    borderRadius: 8,
    flexShrink: 0,
    paddingBlock: '2rem',
    transition: '0.15s ease-out',
    background: 'center center no-repeat var(--image-preview-url)',
    backgroundSize: 'cover',
    cursor: 'pointer',
  },
  $iconInputWithNoImage: {
    backgroundColor: 'var(--gray3)',
    ':hover': {
      backgroundColor: 'var(--gray4)',
    }
  }
})

export default function IconInput() {
  const [imagePreviewUrl, setImagePreviewUrl] = createSignal()
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
        setImagePreviewUrl(binaryStr)
      }

      reader.readAsDataURL(acceptedFiles[0])
    }
  })

  return (
    <FlexCenterX {...dropzone.getRootProps()} style={{
      '--image-preview-url': `url('${imagePreviewUrl()}')`
    }}>
      <input {...dropzone.getInputProps()} />
      <FlexCenter {...stylex.attrs(
        style.$iconInput, 
        imagePreviewUrl() ? {} : style.$iconInputWithNoImage
      )}>
        <Show when={!imagePreviewUrl()}>
          <BsFileImageFill size={30} />
        </Show>
      </FlexCenter>
    </FlexCenterX>
  )
}