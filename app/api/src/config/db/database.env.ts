import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  MYSQL_ROOT_USER: process.env.MYSQL_ROOT_USER,
  MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,

  DB_PORT: process.env.DB_PORT,
  DB_HOST: !process.env.DB_HOST ? 'localhost' : process.env.DB_HOST,
  DB_SCHEMA: process.env.DB_SCHEMA,
}));
