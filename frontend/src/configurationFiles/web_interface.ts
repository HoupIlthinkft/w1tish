const apiURL: string = import.meta.env.VITE_API_URL;

export class WSClient {
  private socket: WebSocket | null = null;

  async connect(token: string) {
    this.socket = new WebSocket(`/ws?token=${token}`);
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

export async function getData(
  apiMethod: string,
  headers?: Record<string, string>, 
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

  if (!headers) {
    headers = {"content-type": "application/json"};
  }

  return await fetch(
    renderURL,
    {method: "GET", headers: headers}
  );
}

export async function postData(
  apiMethod: string,
  body: Record<string, any>,
  headers?: Record<string, string>,
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

  if (!headers) {
    headers = {"content-type": "application/json"};
  }

  return await fetch(
    renderURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
  });
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
