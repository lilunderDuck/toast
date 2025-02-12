import type { ExternalToolSettings } from '@editorjs/editorjs/types/tools'
import ColorPickerTool from 'editorjs-color-picker'

/**For some reason, `editorjs-color-picker` doesn't export the `ColorPickerConfig`,
 * which is why I have to copy the `ColorPickerConfig` type into here.
 * 
 * That goes well.
 */
type ColorPickerConfigOptions = {
  /**Array of colors you want
   * 
   * @note there're default color
   */
  colors: string[];
  /**Number of columns to display
   * @default 7
   */
  columns: number;
}

export function createColorPicker(): ExternalToolSettings<ColorPickerConfigOptions> {
  return {
    // @ts-ignore - it DOES work
    class: ColorPickerTool,
    config: {
      colors: [''],
      columns: 3
    } as ColorPickerConfigOptions
  }
}