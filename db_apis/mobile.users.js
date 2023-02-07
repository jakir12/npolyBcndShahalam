import OracleDB from 'oracledb';

import { simpleExecute } from '../services/database.js';

const baseQuery = `SELECT 
    employee_code "employeeNumber",
    full_name "employeeName",
    sl "designationId",
    designation "designation",
    office_id_card "officeIdCard",
    phone "phone"
  FROM APPS.XXDESIGNATIONWISESRZMDM@SALES`;

export async function getSalesEmployees(context) {
  let query = baseQuery;
  const binds = {};

  const result = await simpleExecute(query, binds);

  return result ? result.rows : null;
}

export async function getOneSalesEmployee(context) {
  let query = baseQuery;
  const binds = {};

  if (context.employee_number) {
    binds.employee_code = context.employee_number;
    query += `\nWHERE employee_code = :employee_code AND phone IS NOT NULL`;
  }

  const result = await simpleExecute(query, binds);

  return result && result.rows && result.rows.length === 1
    ? result.rows[0]
    : null;
}

const userBaseQuery = `SELECT
    employee_number "employee_number",
    employee_name "employee_name",
    password_hash "password_hash"
  FROM 
    XX_MOBILE_APP_USERS`;

export async function findMobileAppUser(context) {
  let query = userBaseQuery;
  const binds = {};

  if (context.employee_number) {
    binds.employee_number = context.employee_number;
    query += `\nWHERE employee_number = :employee_number`;
  }

  const result = await simpleExecute(query, binds);

  return result && result.rows && result.rows.length === 1
    ? result.rows[0]
    : null;
}

const createSql = `insert into XX_MOBILE_APP_USERS (
    employee_number,
    employee_name,
    password_hash
  ) values (
    :employee_number,
    :employee_name,
    :password_hash
  ) returning id
  into :id`;

export async function createMobileAppUser(context) {
  const employee = {};

  employee.id = {
    dir: OracleDB.BIND_OUT,
    type: OracleDB.NUMBER,
  };

  employee.employee_number = context.employee_number;
  employee.employee_name = context.employee_name;
  employee.password_hash = context.password_hash;

  const result = await simpleExecute(createSql, employee);

  employee.id = result.outBinds.id[0];
  return employee.id ? employee : null;
}

export async function updatePassword(context) {
  let query = `UPDATE XX_MOBILE_APP_USERS`;
  const binds = {};

  if (context.employee_number && context.password_hash) {
    binds.employee_number = context.employee_number;
    binds.password_hash = context.password_hash;

    query += `\nSET
        password_hash = :password_hash,
        updated_at = SYSDATE
    WHERE employee_number = :employee_number`;
  }

  const result = await simpleExecute(query, binds);

  return result.rowsAffected === 1 ? true : false;
}

export async function updateMobileUser(context) {
  let query = updateSql;
  const binds = {};

  if (context.employee_number && context.password_hash) {
    binds.employee_number = context.employee_number;
    binds.password_hash = context.password_hash;

    query += `UPDATE XX_MOBILE_APP_USERS
    SET
        password_hash = :password_hash,
        updated_at = SYSDATE
    WHERE employee_number = :employee_number`;
  } else if (context.employee_number && context.password_hash) {
    binds.employee_number = context.employee_number;
    binds.password_hash = context.password_hash;
  }

  const result = await simpleExecute(query, binds);

  return result.rowsAffected === 1 ? true : false;
}
