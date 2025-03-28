import stylex from "@stylexjs/stylex";

const TAB_LIST_THICCNESS = 34 //px
const TAB_MARGIN_TOP = 7 //px

export const tabVars = stylex.defineVars({
  tabListThiccness: `${TAB_LIST_THICCNESS}px`,
  tabTopMargin: `${TAB_MARGIN_TOP}px`,
  tabThiccness: `${TAB_LIST_THICCNESS - TAB_MARGIN_TOP}px`,
})