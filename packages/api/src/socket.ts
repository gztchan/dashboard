

export async function socket(url: string): Promise<WebSocket> {
  return new WebSocket(url);
}
