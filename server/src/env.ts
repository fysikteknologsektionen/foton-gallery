import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })

// Required env vars
const requiredVars = ['APP_HOST', 'APP_PORT', 'APP_SECRET'];

// Dict with verified env vars
export const config: { [index: string]: string } = {};

// Check if required env vars are set, else throw error
requiredVars.map(variable => {
  if (!process.env[variable])
    throw new Error(`${variable} is not defined, add it to the .env file`);
  else
    config[variable] = process.env[variable]!;
});