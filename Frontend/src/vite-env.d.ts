/// <reference types="vite/client" />

declare global {
  const __WS_TOKEN__: string;
  var global: typeof globalThis;
}

export {};