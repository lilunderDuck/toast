/**
 * This script is used to run additional tasks (mainly for hacky purposes),
 * after vite build command.
 */
import { manuallyCopyPublicFolder } from "./hacky/index.ts"

await manuallyCopyPublicFolder()

export {}