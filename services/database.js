import OracleDB from 'oracledb';
import { dbPool } from '../config/database.js';

export async function init() {
  await OracleDB.createPool(dbPool);
}

export async function close() {
  await OracleDB.getPool().close(10);
}

export function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = OracleDB.OBJECT;
    opts.autoCommit = true;

    try {
      conn = await OracleDB.getConnection();

      const result = await conn.execute(statement, binds, opts);

      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}
