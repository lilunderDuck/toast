export const TOKEN_CONFIG = [
  {
    name: "defined token list",
    token: [
      "data-component-hover-card",
      "data-component-tooltip",
      "data-component-context-menu",
      "data-component-dialog-overlay",
      "data-component-dialog-content",
      "data-component-dropdown-menu",
      "data-gallery-view",
      "data-gallery-view-media-content",
      "data-playlist-item-focused",
      "data-playlist-item-id",
      "data-block",
      "data-link-no-color",
      "data-no-focus-highlight",
      "data-editor",
      "data-node-view-content",
      "data-node-view-wrapper",
      "data-solid-renderer",
      "data-component-toast-visible",
      "data-component-toast-hidden",
      "data-journal-side-bar-panel",
      "data-journal-main-content-panel"
    ],
    scope: ["js", "css"]
  },
  {
    name: "CSS animation name",
    token: [
      "animation_fadeAndZoomOut",
      "animation_fadeAndZoomIn",
      "animation_fadeOut",
      "animation_fadeIn",
    ],
    scope: ["css"]
  },
  {
    name: "CSS vars",
    token: /--[a-zA-Z0-9_-]+/gm,
    scope: ["js", "css"]
  }
]