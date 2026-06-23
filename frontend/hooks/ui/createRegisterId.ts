import type { Setter } from "solid-js";

/**
 * Create a function that call the setter with an id and return a function to reset it.
 * @see https://github.com/kobaltedev/kobalte/blob/main/packages/core/src/primitives/create-register-id/create-register-id.ts
 */
export function createRegisterId(setter: Setter<string | undefined>) {
	return (id: string) => {
		setter(id);
		return () => setter(undefined);
	};
}