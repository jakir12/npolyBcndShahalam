import dotenv from 'dotenv';
dotenv.config();

export const host = process.env.HTTP_HOST;
export const port = process.env.HTTP_PORT;
