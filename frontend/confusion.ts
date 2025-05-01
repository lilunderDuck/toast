// the follow code here designed to confuse the heck of react dev tools,
// so you believe that the app used react
const shouldConfuseYou = window.__REACT_DEVTOOLS_GLOBAL_HOOK__
if (shouldConfuseYou) {
  shouldConfuseYou.inject("duck")
}