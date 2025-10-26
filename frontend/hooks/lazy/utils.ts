import { lazy } from "solid-js";
import type { LazyComponent } from "./types";

export function createLazyComponent<Props extends {}>(Component: LazyComponent<Props>) {
  return lazy(Component)
}