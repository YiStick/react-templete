import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { setupInterceptors } from './interceptor';
import type { RequestConfig } from './interceptor';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const requestInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(requestInstance);

export const request = <T = unknown>(config: RequestConfig): Promise<T> =>
  requestInstance.request<any, T>(config);

export const requestRaw = <T = unknown>(
  config: RequestConfig,
): Promise<AxiosResponse<T>> => requestInstance.request<T, AxiosResponse<T>>(config);

export const get = <T = unknown>(url: string, params?: Record<string, unknown>, config?: RequestConfig) =>
  request<T>({
    url,
    method: 'GET',
    params,
    ...config,
  });

export const post = <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
  request<T>({
    url,
    method: 'POST',
    data,
    ...config,
  });

export { upload } from './upload';
export { download } from './download';
export type { RequestConfig } from './interceptor';
