import type { RequestConfig } from './interceptor';
import { request } from './index';

export const upload = <T = unknown>(
  url: string,
  formData: FormData,
  config?: RequestConfig,
): Promise<T> =>
  request<T>({
    url,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
