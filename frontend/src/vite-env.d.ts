/// <reference types="vite/client" />

declare module '@api' {
  export const getData: (url: string) => Promise<any>;
}