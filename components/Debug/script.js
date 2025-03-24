// Debug/script.js
export const DEBUG_MODE = true;

export function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log(...args);
  }
}