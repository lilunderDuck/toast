import { createSignal } from "solid-js";
import type { IPreviewable } from "~/features/settings";

export interface ILogMessage {
  id$: number;
  text$: string;
  isFading$: boolean;
}

export function createlogMessageManager(props: IPreviewable) {
  const [logs, setLogs] = createSignal<ILogMessage[]>([]);
  let logIdCounter = 0;

  const pushLog = (text: string) => {
    const currentId = logIdCounter++
    const newLog: ILogMessage = { id$: currentId, text$: text, isFading$: false }

    setLogs((prev) => {
      // keep only the last message if adding a new one would make it 3
      const base = prev.length >= 2 ? prev.slice(1) : prev;
      return [...base, newLog];
    })

    if (props.preview$) {
      console.log("Don't clear text because it's in preview mode in setting page.")
      return
    }

    // start fading out after 2.5 seconds
    setTimeout(() => {
      setLogs((prev) =>
        prev.map((l) => (l.id$ === currentId ? { ...l, isFading: true } : l))
      )
    }, 2500)

    // completely remove from DOM
    setTimeout(() => {
      setLogs((prev) => prev.filter((l) => l.id$ !== currentId))
    }, 2500 + 2.75 * 1000)
  }

  return {
    logMessages$: logs,
    pushLogMessage$: pushLog
  }
}