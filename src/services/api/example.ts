import { get, post } from '@/utils/request';

export const fetchExampleList = () => get('/api/example');
export const createExample = (payload: Record<string, unknown>) => post('/api/example', payload);
