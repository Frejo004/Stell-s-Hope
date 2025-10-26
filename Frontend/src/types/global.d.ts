/// <reference types="vite/client" />

declare namespace NodeJS {
  type Timeout = ReturnType<typeof setTimeout>;
  type Immediate = ReturnType<typeof setImmediate>;
  type Timer = Timeout | Immediate;
}
