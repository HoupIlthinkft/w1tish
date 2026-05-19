/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

declare module '@api' {
  export interface WSClient {
    connect(): Promise<void>;
    send(data: string | ArrayBuffer): Promise<void>;
    onMessage(callback: (data: any) => void): void;
    close(): void;
  }

  
  /**
   * # Надстройка js:fetch
   * 
   * Принимает путь к ручке и автоматически подставляет адрес сервера,
   * автоматически подставляет `content-type: aplication/json` если заголовки **не указаны**.
   * 
   * ## Params:
   * **apiMethod**: ручка без адреса сервера `"api/message"`
   *
   * **query**: query параметры или ничего
   * 
   * **content**: нагрузка запроса:
   * ```typescript
   * {
   *  method: string, // метод запроса,
   *  headers: Record<string, string>, // заголовки запроса
   *  body: string // контент запроса
   * }
  */
  export const makeRequest: (
    apiMethod: string,
    content: Record<string, any>,
    query?: Record<string, string>
  ) => Promise<Response>;
}