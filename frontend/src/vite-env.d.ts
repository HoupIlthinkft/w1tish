/// <reference types="vite/client" />

declare module '@api' {
  export const getData: () => Promise<any>;
}