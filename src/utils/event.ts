type EventMap = { [eventName: string]: AnyFunction }

export interface IEvent<TEvent extends EventMap> {
  /**Adds a listener to the specified event. 
   * @example
   * ```js
   * const event = createEvent()
   * 
   * event.on$('some_event', () => {
   *   console.log("'some_event' called")
   * })
   * // call the event
   * event.emit$('some_event')
   * // should console out "'some_event' called"
   * ```
   */
  on$<TEventName extends keyof TEvent>(eventName: TEventName, fn: TEvent[TEventName]): void
  /**Adds a "one-time" listener for the event named `eventName`. 
   * The next time eventName is triggered, this listener is removed and then invoked.
   * @example
   * ```js
   * const event = createEvent()
   * 
   * event.once$('some_event', () => {
   *   console.log("'some_event' called")
   * })
   * // call the event
   * event.emit$('some_event')
   * // should console out "'some_event' called"
   * ```
   */
  once$<TEventName extends keyof TEvent>(eventName: TEventName, fn: TEvent[TEventName]): void
  /**Removes the specified listener from the listener array for the event named `eventName`.
   * @example
   * ```js
   * const event = createEvent()
   * const callback = () => {
   *   console.log('something happen!');
   * }
   * 
   * event.on$('some_event', callback);
   * // ...
   * event.off$('some_event', callback); 
   * ```
   * @param eventName 
   * @param fn 
   */
  off$<TEventName extends keyof TEvent>(eventName: TEventName, fn: TEvent[TEventName]): void
  /**Synchronously calls each of the listeners registered for the event named `eventName`, 
   * in the order they were registered, passing the supplied arguments to each.
   * @example
   * ```js
   * const event = createEvent();
   *
   * // First listener
   * event.on$('some_event', firstListener() => {
   *   console.log('Helloooo! first listener');
   * });
   * // Second listener
   * event.on$('some_event', secondListener(arg1, arg2) => {
   *   console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
   * });
   * // Third listener
   * event.on$('some_event', thirdListener(...args) => {
   *   const parameters = args.join(', ');
   *   console.log(`event with parameters ${parameters} in third listener`);
   * });
   *
   *
   * event.emit$('some_event', 1, 2, 3, 4, 5);
   *
   * // Helloooo! first listener
   * // event with parameters 1, 2 in second listener
   * // event with parameters 1, 2, 3, 4, 5 in third listener
   * ```
   * @param eventName 
   * @param args
   */
  emit$<TEventName extends keyof TEvent>(eventName: TEventName, ...args: Parameters<TEvent[TEventName]>): boolean
}

export function createEvent<T extends EventMap>(): IEvent<T> {
  const listeners = {} as Record<keyof T, any[]>

  return {
    on$(eventName, fn) {
      listeners[eventName] = listeners[eventName] || []
      listeners[eventName].push(fn)
    },
    once$(eventName, fn) {
      listeners[eventName] = listeners[eventName] || []
      const onceWrapper = () => { 
        fn()
        this.off$(eventName, onceWrapper as any)
      }
      listeners[eventName].push(onceWrapper)
    },
    off$(eventName, fn) {
      let listener = listeners[eventName]
      if (!listener) return
      for(let i = listener.length; i > 0; i--) {
        if (listener[i] === fn) {
          listener.splice(i,1)
          break
        }
      }
    },
    emit$(eventName, ...args) {
      console.log('[event] emitting:', eventName, 'with', args)
      let _listeners = listeners[eventName]
      if (!_listeners) return true
      for (const listener of _listeners) {
        listener(...args)
      }

      return false
    }
  }
}