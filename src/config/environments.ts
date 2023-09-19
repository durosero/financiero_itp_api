import { BASE_URL, PREFIX } from 'src/main';

export const environments: {
  [key: string]: string;
} = {
  ['dev']: '.env',
  ['stag']: '.staging.env',
  ['pro']: '.production.env',
};

export function getEnvirontment() {
  const env = process.env.NODE_ENV ?? 'dev';
  return environments[env] ?? '.env';
}

export function getBaseUrl(): string {
  const url = new URL(PREFIX, BASE_URL);
  return url.toString();
}
