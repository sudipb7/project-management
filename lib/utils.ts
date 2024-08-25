import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildUrl(url: string, queryObject?: { [key: string]: any }) {
  if (!queryObject) {
    return url;
  }

  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(queryObject)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  }

  const queryString = queryParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}
