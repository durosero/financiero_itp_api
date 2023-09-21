import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  const env = process.env;

  return {};
});
