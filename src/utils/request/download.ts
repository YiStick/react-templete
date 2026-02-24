import type { AxiosResponse } from 'axios';
import { requestRaw } from './index';
import type { RequestConfig } from './interceptor';

const getFilenameFromHeaders = (headers: AxiosResponse['headers']): string | undefined => {
  const disposition = headers?.['content-disposition'] as string | undefined;
  if (!disposition) {
    return undefined;
  }
  const utfMatch = disposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1].replace(/"/g, ''));
  }
  const asciiMatch = disposition.match(/filename="?([^";]+)"?/i);
  return asciiMatch?.[1];
};

export const download = async (
  url: string,
  params?: Record<string, unknown>,
  filename?: string,
  config?: RequestConfig,
) => {
  const response = await requestRaw<Blob>({
    url,
    method: 'GET',
    params,
    responseType: 'blob',
    rawResponse: true,
    ...config,
  });

  const blob = response.data;
  const name = filename || getFilenameFromHeaders(response.headers) || 'download';
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
};
