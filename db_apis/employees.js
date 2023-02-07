import OracleDB from 'oracledb';

import { simpleExecute } from '../services/database.js';

const baseQuery = `SELECT DISTINCT
    employee_number "employeeNumber",
    last_name "employeeName",
    attribute3 "officeIdCard",
    national_identifier "nid",
    attribute5 "phone",
    sex "sex",
    attribute6 "bloodGroup",
    attribute8 "religion"
  FROM APPS.PER_PEOPLE_F@SALES
WHERE sysdate BETWEEN effective_start_date AND effective_end_date`;

export async function get(context) {
  let query = baseQuery;
  const binds = {};

  if (context.phone !== undefined) {
    binds.phone = context.phone;
    query += `\nAND attribute5 = :phone`;
  } else if (context.employee_number !== undefined) {
    binds.employee_number = context.employee_number;
    query += `\nAND employee_number = :employee_number`;
  } else {
    query += `\nORDER BY employee_number`;
  }

  const result = await simpleExecute(query, binds);

  return result.rows.length === 0
    ? null
    : result.rows.length === 1
    ? result.rows[0]
    : result.rows;
}

const createSql = `insert into employees (
    first_name,
    last_name,
    email,
    phone_number,
    hire_date,
    job_id,
    salary,
    commission_pct,
    manager_id,
    department_id
  ) values (
    :first_name,
    :last_name,
    :email,
    :phone_number,
    :hire_date,
    :job_id,
    :salary,
    :commission_pct,
    :manager_id,
    :department_id
  ) returning employee_id
  into :employee_id`;

export async function create(emp) {
  const employee = Object.assign({}, emp);

  employee.employee_id = {
    dir: OracleDB.BIND_OUT,
    type: OracleDB.NUMBER,
  };

  const result = await simpleExecute(createSql, employee);

  employee.employee_id = result.outBinds.employee_id[0];

  return employee;
}

const updateSql = `update employees
  set first_name = :first_name,
    last_name = :last_name,
    email = :email,
    phone_number = :phone_number,
    hire_date = :hire_date,
    job_id = :job_id,
    salary = :salary,
    commission_pct = :commission_pct,
    manager_id = :manager_id,
    department_id = :department_id
  where employee_id = :employee_id`;

export async function update(emp) {
  const employee = Object.assign({}, emp);
  const result = await simpleExecute(updateSql, employee);

  if (result.rowsAffected && result.rowsAffected === 1) {
    return employee;
  } else {
    return null;
  }
}

const deleteSql = `begin

    delete from job_history
    where employee_id = :employee_id;

    delete from employees
    where employee_id = :employee_id;

    :rowcount := sql%rowcount;

  end;`;

export async function del(id) {
  const binds = {
    employee_id: id,
    rowcount: {
      dir: BIND_OUT,
      type: NUMBER,
    },
  };
  const result = await simpleExecute(deleteSql, binds);

  return result.outBinds.rowcount === 1;
}

const salesEmpBaseQuery = `SELECT 
    employee_code "employeeNumber",
    full_name "employeeName",
    sl "designationId",
    designation "designation",
    office_id_card "officeIdCard",
    nid "nid",
    phone "phone",
    sex "gender",
    blood_group "bloodGroup",
    religion "religion"
  FROM APPS.XXDESIGNATIONWISESRZMDM@SALES`;

export async function getSR(context) {
  let query = salesEmpBaseQuery;
  query += `\nWHERE sl = 3`;
  const binds = {};

  if (context.employee_number !== undefined) {
    binds.employee_number = context.employee_number;
    query += `\nAND employee_code = :employee_number`;
  } else {
    query += `\nORDER BY employee_code`;
  }

  const result = await simpleExecute(query, binds);

  return result.rows.length === 0
    ? null
    : result.rows.length === 1
    ? result.rows[0]
    : result.rows;
}

export async function getZM(context) {
  let query = salesEmpBaseQuery;
  query += `\nWHERE sl = 2`;
  const binds = {};

  if (context.employee_number !== undefined) {
    binds.employee_number = context.employee_number;
    query += `\nAND employee_code = :employee_number`;
  } else {
    query += `\nORDER BY employee_code`;
  }

  const result = await simpleExecute(query, binds);

  return result.rows.length === 0
    ? null
    : result.rows.length === 1
    ? result.rows[0]
    : result.rows;
}

export async function getDSM(context) {
  let query = salesEmpBaseQuery;
  query += `\nWHERE sl = 1`;
  const binds = {};

  if (context.employee_number !== undefined) {
    binds.employee_number = context.employee_number;
    query += `\nAND employee_code = :employee_number`;
  } else {
    query += `\nORDER BY employee_code`;
  }

  const result = await simpleExecute(query, binds);

  return result.rows.length === 0
    ? null
    : result.rows.length === 1
    ? result.rows[0]
    : result.rows;
}
