import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

export type RequestConfig = AxiosRequestConfig & {
  repeatable?: boolean;
  rawResponse?: boolean;
  requestKey?: string;
};

const pendingMap = new Map<string, AbortController>();

const stableStringify = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value !== 'object') {
    return String(value);
  }
  if (typeof FormData !== 'undefined' && value instanceof FormData) {
    const entries = Array.from(value.entries()).map(([key, val]) => {
      if (val instanceof File) {
        return `${key}:${val.name}`;
      }
      if (val instanceof Blob) {
        return `${key}:blob`;
      }
      return `${key}:${String(val)}`;
    });
    return `formdata:${entries.join('|')}`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return `{${keys.map((key) => `${key}:${stableStringify((value as Record<string, unknown>)[key])}`).join(',')}}`;
};

const getRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  return [method, url, stableStringify(params), stableStringify(data)].filter(Boolean).join('|');
};

const addPending = (config: InternalAxiosRequestConfig & RequestConfig) => {
  const requestKey = getRequestKey(config);
  config.requestKey = requestKey;

  if (!config.repeatable && pendingMap.has(requestKey)) {
    pendingMap.get(requestKey)?.abort('Canceled duplicate request');
    pendingMap.delete(requestKey);
  }

  const controller = new AbortController();
  config.signal = controller.signal;
  pendingMap.set(requestKey, controller);
};

const removePending = (config?: RequestConfig) => {
  if (!config?.requestKey) {
    return;
  }
  pendingMap.delete(config.requestKey);
};

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      addPending(config as InternalAxiosRequestConfig & RequestConfig);
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      removePending(response.config as RequestConfig);
      const config = response.config as RequestConfig;

      if (config.rawResponse) {
        return response;
      }

      const data = response.data;
      if (data && typeof data === 'object' && 'code' in data && 'data' in data) {
        if (data.code === 0) {
          return data.data;
        }
        return Promise.reject(new Error(data.message || 'Request Error'));
      }
      return data;
    },
    (error) => {
      const config = error?.config as RequestConfig | undefined;
      removePending(config);
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }
      const message = error?.response?.data?.message || error.message || 'Network Error';
      return Promise.reject(new Error(message));
    },
  );
};
