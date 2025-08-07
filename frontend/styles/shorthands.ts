import stylex from "@stylexjs/stylex";

export const shorthands = stylex.create({
  /**Short hand for `width: 100%; height: 100%` */
  wh_full$: {
    width: "100%",
    height: "100%",
  },
  wh_full_before$: {
    "::before": {
      width: "100%",
      height: "100%",
    }
  },
  w_full$: {
    width: "100%",
  },
  h_full$: {
    height: "100%",
  },
  flex_center$: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  flex_x_center$: {
    display: "flex",
    justifyContent: "center"
  },
  flex_flow_colum: {
    display: "flex",
    flexDirection: "column"
  },
  flex_y_center$: {
    display: "flex",
    alignItems: "center"
  },
  flex$: {
    display: 'flex'
  },
  spacer$: {
    flex: '1 1 0%',
    placeSelf: 'stretch'
  },
  scrollbar_vertical$: {
    overflowY: 'scroll'
  },
  scrollbar_horizontal$: {
    overflowX: 'scroll'
  },
  background_image$: {
    background: "center center no-repeat var(--img-url)",
    backgroundSize: "cover"
  }
})