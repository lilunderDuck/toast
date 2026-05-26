import stylex from "@stylexjs/stylex"
import fox_spinning_spritesheet from "../../../assets/fox_running.png"

const style = stylex.create({
  spinningFox: {
    width: "256px",
    height: "150px",
    position: "absolute",
    bottom: 0,
    right: -30,
    backgroundImage: "var(--sprite-url)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% auto", // Forces the background width to match the div, auto calculates the tall height
    // The keyframes move the background UPWARDS 
    animationName: stylex.keyframes({
      from: { backgroundPosition: "0px 0px" },
      // 3584px is the total height, so moving it to -3584px cycles through every frame
      to: { backgroundPosition: "0px -3584px" } 
    }),
    
    animationDuration: "1.2s", // Adjust this to make the fox spin faster or slower
    animationIterationCount: "infinite",
    animationTimingFunction: "steps(28)"
  },
  spinningFox__version: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 5
  }
})

export function NeoforgeSpinningFoxIcon() {
  return (
    <>
      <div 
        {...stylex.attrs(style.spinningFox)} 
        style={`--sprite-url:url("${fox_spinning_spritesheet}")`}
      />
      <div {...stylex.attrs(style.spinningFox__version)}>
        toast_1.0.0 {TOAST_DEBUG ? "DEBUG BUILD" : "RELEASE BUILD"}
      </div>
    </>
  )
}