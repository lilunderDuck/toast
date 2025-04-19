import stylex from "@stylexjs/stylex"
import { BsFileImageFill } from "solid-icons/bs"
import { createSignal, Show } from "solid-js"
import { api_uploadJournalGroupPreviewIcon } from "~/api/media"
import { FlexCenter } from "~/components"
import { createFileUpload, FileUploadType } from "~/features/file-uploads"

const style = stylex.create({
  iconInput: {
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
  iconInputWithNoImage: {
    backgroundColor: 'var(--gray3)',
    ':hover': {
      backgroundColor: 'var(--gray4)',
    }
  }
})

interface IIconInputProps {
  choosenFilePath$(file: string | undefined): any
}

export default function IconInput(props: IIconInputProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = createSignal()

  const { FileUploadZone$ } = createFileUpload({
    title$: "Please select an image file",
    type$: FileUploadType.file,
    filter$() {
      return [
        { name: "*.png", extension: "png" },
        { name: "*.jpeg", extension: "jpeg" },
      ]
    },
    async onFinish$(file) {
      await api_uploadJournalGroupPreviewIcon(file)
      setImagePreviewUrl("http://localhost:8080/dynamic/cache/preview.png")
      props.choosenFilePath$(file)
    },
  })

  return (
    <FileUploadZone$ style={{
      '--image-preview-url': `url('${imagePreviewUrl()}')`
    }}>
      <FlexCenter {...stylex.attrs(
        style.iconInput, 
        imagePreviewUrl() ? {} : style.iconInputWithNoImage
      )}>
        <Show when={!imagePreviewUrl()}>
          <BsFileImageFill size={30} />
        </Show>
      </FlexCenter>
    </FileUploadZone$>
  )
}