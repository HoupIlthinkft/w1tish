/// <reference types="vite/client" />

import { refreshToken } from './requests';

const apiURL: string = import.meta.env.API_URL;

export class WSClient {
  private socket: WebSocket | null = null;
  private savedToken: string = '';
  private isConnected: boolean = false;

  async connect(token: string) {
    this.savedToken = token;

    const renderURL = 'ws' + `${apiURL}/ws?token=${token}`.slice(4);
    this.socket = new WebSocket(renderURL);

    this.socket.onopen = () => {
      this.isConnected = true;
    };
    this.socket.onclose = () => {
      setTimeout(() => this.connect(this.savedToken), 2000);
    };

    this.socket.onerror = (event) => {
      if (event.type == 'error' && !this.isConnected) {
        refreshToken();
      }
    };
    return new Promise<void>((res) => {
      this.socket!.onopen = () => res();
    });
  }

  async send(data: string) {
    this.socket?.send(data);
    console.log(data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.onmessage = (event) => callback(event.data);
    }
  }

  close() {
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.close();
    }
  }
}

export async function makeRequest(
  apiMethod: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>,
  query?: Record<string, string>,
) {
  let renderURL = `${apiURL}${apiMethod}`;

  if (query) {
    renderURL += '?';
    for (const key of Object.keys(query)) {
      renderURL += `${key}=${query[key]}&`;
    }
    renderURL = renderURL.slice(0, -1);
  }

  return await fetch(renderURL, content);
}
