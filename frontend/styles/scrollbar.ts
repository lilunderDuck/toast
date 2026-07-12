import { css } from "molcss";

export const scrollbar = css`
  --sb-track-color: var(--base);
  --sb-thumb-color: var(--surface0);
  --sb-border-radius: 3px;
  --sb-thumb-pad: 1px;
  --sb-size: 12px;
  will-change: transform;
  &::-webkit-scrollbar {
    width: var(--sb-size);
    height: var(--sb-size);
  }

  &::-webkit-scrollbar-track {
    background: var(--sb-track-color);
    border-radius: var(--sb-border-radius);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--sb-thumb-color);
    border-radius: var(--sb-border-radius);
    border: var(--sb-thumb-pad) solid var(--sb-track-color);
  }
`

export const scrollbar__vertical = css`
  overflow-y: auto;
`

export const scrollbar__horizontal = css`
  overflow-x: auto;
`

export const scrollbar__invs = css`
  &::-webkit-scrollbar {
    display: none;
  }
`