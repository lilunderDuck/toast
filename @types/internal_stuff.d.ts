declare global {
  /**Well, it's `true` if you're on development mode, `false` otherwise.
   * 
   * Behind the scene: it uses [esbuild's `defind` option](https://esbuild.github.io/api/#define)
   * to change some of the behavior of some part of the code between builds.
   * 
   * Example, if I have this piece of code here
   * ```
   * const something = __devMode ? "dev mode" : "prod mode"
   * ``` 
   * 
   * ...and build the app via `npm run build:app`, it will turn into this:
   * ```
   * const something = "prod mode"
   * ``` 
   * 
   * Same for development mode, run `npm run dev`, it will turn into this:
   * ```
   * const something = "dev mode"
   * ``` 
   * 
   * @see https://esbuild.github.io/api/#define
   */
  const __devMode: boolean
}

export {}