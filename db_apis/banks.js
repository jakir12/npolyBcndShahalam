import { simpleExecute } from '../services/database.js';

const baseQuery = `SELECT 
  RECEIPT_METHOD_ID "receipt_method_id",
  REMIT_BANK_ACCT_USE_ID "remit_bank_acct_use_id",
  BANK_ACCOUNT_ID "id", 
  BANK_NAME "title", 
  BANK_ACCOUNT_NAME "account_name",
  BANK_ACCOUNT_NUM "bank_account_number",
  BANK_BRANCH_NAME "branch_name",
  ORG_ID "org_id",
  SHORT_BANK_NAME "short_bank_name"
FROM 
APPS.XXBANKMOBILE_APPS@SALES`;

export async function get(context) {
  let query = baseQuery;
  const binds = {};

  if (context.org_id) {
    binds.org_id = context.org_id;
    query += `\nWHERE ORG_ID = :org_id`;
  }
  
  const result = await simpleExecute(query, binds);
  return result.rows !== null ? result.rows : null;
}


export async function getById(id) {
  const result = await simpleExecute(`${baseQuery} WHERE ID = :id`, { id });
  return result.rows.length > 0 ? result.rows[0] : null;
}


export async function getSingleBank(context) {
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    binds.id = context.id;

    query += `\nWHERE BANK_ACCOUNT_ID = :id`;
  }
  
  const result = await simpleExecute(query, binds);
  return result.rows.length > 0 ? result.rows[0] : null;
}