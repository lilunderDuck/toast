import { IBlockSetting } from "../provider"

type LinkBlockData = {
  link: string
}

export function createLinkBlock(): IBlockSetting<LinkBlockData> {
  return {
    displayName$: "Link",
    get defaultValue$() {
      return {
        link: ''
      }
    },
    blockComponent$(props) {
      return (
        <div></div>       
      )
    }
  }
}