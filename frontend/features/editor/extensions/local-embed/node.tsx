import { createFileUpload, FileUploadType } from "~/features/native"
// ...
import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"
// ...
import { NodeViewWrapper } from "../../components"
import { useLocalEmbedContext } from "./provider"
import { Show } from "solid-js"

const style = stylex.create({
  embed: {
    width: "100%",
    height: "20rem",
    overflow: "hidden",
    userSelect: "none",
  },
  embed__fullscreen: {
    paddingBlock: "2rem",
  },
  embed__empty: {
    backgroundColor: "var(--gray3)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    border: "2px solid transparent",
    borderRadius: 6,
    ":hover": {
      borderColor: "var(--gray7)"
    }
  },
  embed__iframe: {
    width: "100%",
    height: "-webkit-fill-available"
  }
})

export default function LocalEmbedNode() {
  const { isEmpty$, isFullscreen$, setRootRef$, upload$, getEmbedUrl$ } = useLocalEmbedContext()

  const { FileUploadZone$ } = createFileUpload({
    type$: FileUploadType.file,
    dialogOptions$: {
      Title: "Choose a html file to embed into your journal.",
      Filters: [
        { DisplayName: "Html files", Pattern: "*.html;*.htm", }
      ]
    },
    async onFinish$(path) {
      console.log(path)
      upload$() // todo
    }
  })

  return (
    <NodeViewWrapper>
      <FileUploadZone$
        {...stylex.attrs(style.embed, isFullscreen$() ? style.embed__fullscreen : {})} 
        ref={setRootRef$}
      >
        <Show when={!isEmpty$()} fallback={
          <div {...stylex.attrs(style.embed__empty)}>
            Click here to upload your embed.
          </div>
        }>
          <iframe
            src={getEmbedUrl$()}
            sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
            referrerPolicy="origin"
            {...stylex.attrs(style.embed__iframe, shorthands.w_full$)}
            // onLoad={() => setIsEmbedLoading(true)}
            onError={() => console.log('error fired')}
          />
        </Show>
      </FileUploadZone$>
    </NodeViewWrapper>
  )
}