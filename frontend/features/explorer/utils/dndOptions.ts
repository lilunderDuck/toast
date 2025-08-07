import { Accessor, JSX } from "solid-js";

/**Options for creating `solid-dnd-directive`'s drag and drop. Briefly copied their 
 * documentation to here, because the package has no documentation.
 * @example 
 * ```tsx
 * import { createSignal } from "solid-js";
 * import {dndzone} from "solid-dnd-directive";
 * const containerStyle = {border: "1px solid black", padding: "0.3em", "max-width": "200px"};
 * const itemStyle = {border: "1px solid blue", padding: "0.3em", margin: "0.2em 0"};
 * 
 * function App() {
 *   const [items, setItems] = createSignal([
 *     {id: 1, title: "item 1"},
 *     {id: 2, title: "item 2"},
 *     {id: 3, title: "item 3"}
 *   ]);
 * 
 *   const handleDndEvent = (e) => { // no type
 *      const {items: newItems} = e.detail;
 *      setItems(newItems);
 *   }
 * 
 *   return (
 *     <main>
 *       <section 
 *         style={containerStyle} 
 *         use:dndzone={{items}} 
 *         on:consider={handleDndEvent} 
 *         on:finalize={handleDndEvent}
 *       >
 *         <For each={items()}>{item => <div style={itemStyle}>{item.title}</div>}</For>
 *       </section>
 *     </main>
 *   );
 * }
 * 
 * export default App;
 * ```
 * @see https://github.com/isaacHagoel/solid-dnd-directive?tab=readme-ov-file#input 
 */
export interface IDndOptions {
  /**The data array that is used to produce the list with the draggable 
   * items (the same thing you run your `<For /> block on). 
   * 
   * The dndzone should not have children that don't originate in items
   * @note Each object in the array **must have an `id` property**.
   * The key name can be overridden globally via [`overrideItemIdKeyNameBeforeInitialisingDndZones()`](https://github.com/isaacHagoel/solid-dnd-directive?tab=readme-ov-file#overriding-the-item-id-key-name) method with a unique value 
   * (within all dnd-zones of the same type)
   */
  items: Accessor<Record<string | number, any>>
  /**The duration of the items animations. Set to zero if you don't want animations
   * @default 150 // milliseconds
   */
  flipDurationMs?: number
  /**dnd-zones that share the same type can have elements from one dragged into another. 
   * 
   * By default, all dnd-zones have the same type
   * @default "Internal"
   */
  type?: string
  /**Setting it to true will make it impossible to drag elements out of the dnd-zone. 
   * You can change it at any time (if you passed in a 
   * [`Signal`](https://docs.solidjs.com/reference/basic-reactivity/create-signal#createsignal)), 
   * and the zone will adjust on the fly.
   * 
   * @example
   * ```tsx
   * const [items, setItems] = createSignal([ ... ])
   * const [isDraggable, setIsDraggable] = createSignal(false)
   * // ... do something with draggable signal ...
   * 
   * <div use:dndzone={{ items, dragDisabled: isDraggable() }} />
   * ```
   * @default false
   */
  dragDisabled?: boolean
  /**By default, when dragging over a zone, the dragged element is morphed 
   * to look like it would if dropped. You can prevent it by setting this option.
   * @default false
   */
  morphDisabled?: boolean
  /**Setting it to true will make it impossible to drop elements from other dnd-zones 
   * of the same type. Can be useful if you want to limit the max number of items for example. 
   * You can change it at any time, and the zone will adjust on the fly
   * @default false
   */
  dropFromOthersDisabled?: boolean
  /**Allow user to set custom tabindex to the list container when not dragging. 
   * Can be useful if you want to make the screen reader to skip the list container. 
   * You can change it at any time.
   * @default 0
   */
  zoneTabIndex?: number
  /**An object of styles to apply to the dnd-zone when items can be dragged into it. 
   * @note The styles override any inline styles applied to the dnd-zone. 
   * When the styles are removed, any original inline styles will be lost
   * @default { outline: 'rgba(255, 255, 102, 0.7) solid 2px' }
   */
  dropTargetStyle?: JSX.CSSProperties
  /**A list of classes to apply to the dnd-zone when items can be dragged into it. 
   * @note make sure the classes you use are available globally.
   * @default []
   */
  dropTargetClasses?: string[]
}

export type DndEvent = CustomEvent<{
  info: {
    id: number
    source: "pointer"
    trigger: "dragEntered"
  }
  items: ReturnType<IDndOptions["items"]>[]
}>

/**Dispatched whenever the dragged element needs to make room for itself in a new 
 * position in the items list and when it leaves. 
 * 
 * The host (your component) is expected to update the items list 
 * (you can keep a copy of the original list if you need to) 
 */
export interface IDndConsiderEvent extends DndEvent {
  type: "consider"
}

/**Dispatched on the target and origin dnd-zones when the dragged element is dropped into position. 
 * 
 * This is the event you want to use to save the items to the server for example. 
 */
export interface IDndFinalizeEvent extends DndEvent {
  type: "finalize"
}