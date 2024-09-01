import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildUrl(pathUrl: string, queryObject?: { [key: string]: any }) {
  const hostName = process.env.NEXT_PUBLIC_SITE_URL;
  if (!queryObject) {
    return hostName + pathUrl;
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
  return queryString ? `${hostName}${pathUrl}?${queryString}` : hostName + pathUrl;
}
