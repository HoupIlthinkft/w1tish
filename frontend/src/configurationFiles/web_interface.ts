/// <reference types="vite/client" />

const apiURL: string = import.meta.env.API_URL;

export class WSClient {
  private socket: WebSocket | null = null;

  async connect(token: string) {
    const renderURL = "ws" + `${apiURL}/ws?token=${token}`.slice(4);
    this.socket = new WebSocket(renderURL);
    return new Promise<void>((res) => {
      this.socket!.onopen = () => res();
    });
  }

  async send(data: string) {
    this.socket?.send(data);
  }

  onMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.onmessage = (event) => callback(event.data);
    }
  }

  close() { this.socket?.close(); }
}

export async function makeRequest(
  apiMethod: string,
  content: Record<string, any>,
  query?: Record<string, string>
) {
  let renderURL = `${apiURL}/${apiMethod}`;

  if (query) {
      renderURL += "?";
      for (let key of Object.keys(query)) {
          renderURL += `${key}=${query[key]}&`;
      }
      renderURL = renderURL.slice(0, -1);
  }

  return await fetch(renderURL, content);
}
