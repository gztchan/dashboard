import { getConfig } from './config';
import axios, { Method } from 'axios';;

export async function request<T>(
  method: Method,
  path: string,
  params?: Record<string, any>,
  data?: Record<string, any>,
  headers?: Record<string, string>,
): Promise<T> {
  const config = getConfig();
  const url = `${path}`;
  const response = await axios.request({
    url,
    method,
    headers: {
      ...(headers ?? {}),
      "content-type": "application/json",
    },
    data,
    params,
  });
  return response.data as T;
}
