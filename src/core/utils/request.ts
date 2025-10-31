import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { waitFor } from './timeout.js';

// In seconds
const MAX_RETRY_TIMEOUT = 15;
// Step in seconds
const RETRY_STEP = 5;

export function requestWithRetry(config: AxiosRequestConfig): Promise<AxiosResponse> {
  return retry(0, config);
}

async function retry(retryCount = 0, config: AxiosRequestConfig): Promise<AxiosResponse> {
  try {
    const result = await axios(config);

    return result;
  } catch (e) {
    const timeout = Math.min(retryCount * RETRY_STEP, MAX_RETRY_TIMEOUT);

    console.error(`Request failed : ${(e as Error).message}`);
    console.error(`Retrying in ${timeout} seconds`);

    await waitFor(timeout * 1000);

    const result = await retry(retryCount + 1, config);

    return result;
  }
}
