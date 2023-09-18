export const environments: {
  [key: string]: string;
} = {
  ['dev']: '.env',
  ['stag']: '.staging.env',
  ['pro']: '.production.env',
};

const portDefault: number = 3001;
export const PORT = process.env.PORT ?? portDefault;
export const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;
export const PREFIX = process.env.GLOBAL_PEFIX ?? '/api/v2';

export function getEnvirontment() {
  const env = process.env.NODE_ENV ?? 'dev';
  return environments[env] ?? '.env';
}

export function getBaseUrl(): string {
  const url = new URL(PREFIX, BASE_URL);
  return url.toString();
}
