import stylex from "@stylexjs/stylex"
import { FlexCenter } from "~/components"

const style = stylex.create({
  previewer: {
    width: '15rem',
    height: '10rem',
    marginTop: 10,
  },
  previewContainer: {
    position: 'relative'
  },
  paddingPreviewer: {
    position: 'absolute',
    backgroundColor: '#2fa5e0'
  },
  paddingTopBottomPreviewer: {
    width: '100%'
  },
  paddingLeftRightPreviewer: {
    height: '100%'
  },
  paddingTop: {
    paddingTop: 'var(--top)',
    top: 'calc(-1 * var(--top))'
  },
  paddingBottom: {
    paddingBottom: 'var(--bottom)',
    bottom: 'calc(-1 * var(--bottom))'
  },
  paddingLeft: {
    paddingLeft: 'var(--left)',
    left: 'calc(-1 * var(--left))'
  },
  paddingRight: {
    paddingRight: 'var(--right)',
    right: 'calc(-1 * var(--right))'
  },
  contentInsideText: {
    fontSize: 14,
    padding: 5
  }
})

interface IPaddingPreviewerProps {
  paddingLeft$: number
  paddingRight$: number
  paddingTop$: number
  paddingBottom$: number
}

export default function PaddingPreviewer(props: IPaddingPreviewerProps) {
  return (
    <FlexCenter 
      {...stylex.attrs(style.previewer)}
      style={{
        '--left': `${props.paddingLeft$}px`,
        '--right': `${props.paddingRight$}px`,
        '--top': `${props.paddingTop$}px`,
        '--bottom': `${props.paddingBottom$}px`,
      }}
    >
      <div {...stylex.attrs(style.previewContainer)}>
        <div {...stylex.attrs(
          style.paddingPreviewer, 
          style.paddingTopBottomPreviewer,
          style.paddingTop
        )} />
        <div {...stylex.attrs(
          style.paddingPreviewer, 
          style.paddingTopBottomPreviewer,
          style.paddingBottom
        )} />
        <div {...stylex.attrs(
          style.paddingPreviewer, 
          style.paddingLeftRightPreviewer,
          style.paddingLeft
        )} />
        <div {...stylex.attrs(
          style.paddingPreviewer, 
          style.paddingLeftRightPreviewer,
          style.paddingRight
        )} />
        <div {...stylex.attrs(style.contentInsideText)}>
          [Content inside]
        </div>
      </div>
    </FlexCenter>
  )
}