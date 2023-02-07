import dotenv from 'dotenv';
dotenv.config();
process.on('unhandledRejection', (error, promise) => {
  console.log(' Sorry ! We forgot to handle a promise rejection here: ', promise);
  console.log(' The error was: ', error );
});
export const dbPool = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectString: process.env.DB_CONNECTIONSTRING,
  poolMin: 10,
  poolMax: 10,
  poolIncrement: 0,
};
