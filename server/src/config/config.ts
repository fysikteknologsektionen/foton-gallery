import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';
import path from 'path';

interface Config {
  NODE_ENV: string;
  APP_HOST: string;
  APP_PORT: number;
  APP_SECRET: string;
  APP_MAX_FILE_SIZE: number;
  APP_MAX_FILE_UPLOADS: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_DATABASE: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

let env = dotenv.config({path: path.join(__dirname, '..', '..', '..', '.env')});
if (env.error) {
  throw env.error;
}
if (env.parsed) {
  env = dotenvParseVariables(env.parsed);
}

export const config = env as Config;
