import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components"
import type { misc } from "~/wailsjs/go/models"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  content: {
    maxWidth: "30rem"
  },
  hoverCard__name: {
    ":hover": {
      textDecoration: "underline"
    }
  }
})

interface ILibraryUsedInfoCardProps extends misc.PackageContentData { }

export default function LibraryUsedInfoCard(props: ILibraryUsedInfoCardProps) {
  const version = () => props.version?.join('.')
  const linkProps: Record<string, string> = {}
  if (!props.homepage) {
    linkProps["data-link-no-color"] = ""
  }

  return (
    <HoverCard>
      <div>
        <HoverCardTrigger href={props.homepage} target="_blank" {...linkProps}>
          <b {...stylex.attrs(style.hoverCard__name)}>
            <code>{props.name}</code>
          </b>
        </HoverCardTrigger>
        <span>{version()}</span>
      </div>
      <HoverCardContent {...stylex.attrs(style.content)}>
        <h3>
          {props.name} 
          <code>{version()}</code>
        </h3>
        <p>
          {props.description}
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}