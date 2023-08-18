export const environments: {
  [key: string]: string;
} = {
  ['dev']: '.env',
  ['stag']: '.stag.env',
  ['production']: '.prod.env',
};
export function getEnvirontment() {
  const env = process.env.NODE_ENV ?? 'dev';

  return environments[env] ?? '.env';
}
