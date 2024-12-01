export const sleep = (delayInMs: number) => new Promise(resolve => setTimeout(resolve, delayInMs))

export const debounce = <Fn extends AnyFunction>(callback: Fn, wait: number) => {
  let timeoutId: number | undefined = undefined
  return (...args: Parameters<Fn>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), wait) as unknown as number
  }
}

export function logThisVeryHelpfulMessage() {
  /**@PURE */
  console.log(
    "%cOkay, hold on.", "font-size:25px",
    "\nThis is a very scary place you know? Pasting any code into here result in *no consequence* whatsoever, because it's just you and yourself.",
    "\n\n",
    "\n---- You're now looking at the app information ----",
    `\nuser: ${navigator.userAgent}`,
    `\napp version           :  v1.0.0`,
    '\napi version           :  v1.0.0',
    '\nusing solidjs version :  v1.8.11',
    '\n\n',
    "\n---- You're now looking at this cute cat ----",
    `
      .        ／＞　 フ
              | 　_　_| 
            ／\` ミ__^ノ 
           /　　　　 |
          /　 ヽ　　 ﾉ              ╱|、
         /　　 |　|　|            (˚ˎ 。7  
        ／￣|　　 |　|　|          |、˜〵          
        (￣ヽ＿_  ヽ_)__)         じしˍ,)ノ
        ＼二)
    `
  )
}