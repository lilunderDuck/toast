import { lazy } from "solid-js";
import { LazyComponent } from "./types";

export function createLazyComponent<Props extends {}>(Component: LazyComponent<Props>) {
  return lazy(Component)
}