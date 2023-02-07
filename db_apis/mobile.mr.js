
import OracleDB from 'oracledb';
import { simpleExecute } from '../services/database.js';

// get all money receipts by created_by or created_by and customer number
export const getMoneyReceipts = async (context) => {
  let query = `SELECT 
    ID "id",
    CUSTOMER_ID "customerId",
    CUSTOMER_NUMBER "customerNumber",
    CUSTOMER_NAME "customerName",
    PRODUCT_NAME "productName",
    BANK_ID "bankId",
    BANK_NAME "bankTitle",
    ACCOUNT_NAME "accountName",
    BRANCH_NAME "branchName",
    DEPOSITOR_NAME "depositor_name",
    DEPOSITOR_PHONE "depositor_phone",
    AMOUNT "amount",
    REMARKS "remarks",
    COMMENTS "comments",
    STATUS "status",
    DEPOSIT_DATE "depositDate",
    SPACIAL_NOTES "spacialNotes",
    REMARKS_APX "remarks_apx",
    CREATED_BY "createdBy",
    CREATED_AT "createdAt",
    UPDATED_AT "updatedAt"
  FROM 
    XX_MOBILE_MONEY_RECEIPT`;

  const binds = {};

  if (context.created_by) {
    binds.created_by = context.created_by;
    binds.status = context.status;

    query += `\nWHERE STATUS = :status AND CREATED_BY = :created_by`;
  } else if (context.created_by && context.customer_id) {

    binds.created_by = context.created_by;
    binds.customer_id = context.customer_id;
    binds.status = context.status;

    query += `\nWHERE STATUS = :status AND CREATED_BY = :created_by AND CUSTOMER_ID = :customer_id`;
  }

  query += `\nORDER BY ID DESC`;

  const result = await simpleExecute(query, binds);
  return result.rows;
};

// get a single money receipt by id
export const getMoneyReceipt = async (context) => {
  let query = `SELECT 
                  ID "id",
                  CUSTOMER_ID "customerId",
                  CUSTOMER_NUMBER "customerNumber",
                  CUSTOMER_NAME "customerName",
                  CUSTOMER_ADDRESS "customerAddress",
                  PRODUCT_NAME "productName",
                  BANK_ID "bankId",
                  BANK_NAME "bankTitle",
                  ACCOUNT_NAME "accountName",
                  BRANCH_NAME "branchName",
                  BANK_ACCOUNT_NUMBER "bankAccountNum",
                  FROM_DEPOSIT "fromDeposit",
                  DEPOSITOR_NAME "depositor_name",
                  DEPOSITOR_PHONE "depositor_phone",
                  AMOUNT "amount",
                  REMARKS "remarks",
                  COMMENTS "comments",
                  ORDER_IDS "orderIds",
                  SALESREPID "salesRepId",
                  ORG_ID "orgId",
                  DEPOSIT_DATE "depositDate",
                  SPACIAL_NOTES "spacialNotes",
                  ATTACHMENT_URL "attachmentUrl",
                  STATUS "status",
                  REMARKS_APX "remarks_apx",
                  FORWARD_REMARKS_APX "forward_remarks_apx",
                  CREATED_BY "createdBy",
                  CREATED_AT "createdAt",
                  UPDATED_AT "updatedAt"
                  
                FROM XX_MOBILE_MONEY_RECEIPT`;

  const binds = {};

  if (context.money_receipt_id) {
    binds.id = context.money_receipt_id;
    query += `\nWHERE ID = :id`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows[0];
};

export const createMoneyReceipt = async (context) => {
  let query = `INSERT INTO XX_MOBILE_MONEY_RECEIPT (
                CUSTOMER_ID,
                PRODUCT_NAME,
                BANK_ID,
                BRANCH_NAME,
                AMOUNT,
                REMARKS,
                CREATED_BY,
                ORDER_IDS,
                BANK_NAME,
                BANK_ACCOUNT_NUMBER,
                FROM_DEPOSIT,
                DEPOSITOR_NAME,
                DEPOSITOR_PHONE,
                COMMENTS,
                CUSTOMER_NAME,
                CUSTOMER_NUMBER,
                CUSTOMER_ADDRESS,
                RECEIPT_METHOD_ID,
                REMIT_BANK_ACCT_USE_ID,
                ACCOUNT_NAME,
                ORG_ID,
                SALESREPID,
                SHORT_BANK_NAME,
                SPACIAL_NOTES,
                DEPOSIT_DATE
              ) VALUES (
                :customer_id,
                :product_name,
                :bank_id,
                :branch_name,
                :amount,
                :remarks,
                :created_by,
                :order_ids,
                :bank_name,
                :bank_account_number,
                :form_deposit,
                :depositor_name,
                :depositor_phone,
                :comments,
                :customer_name,
                :customer_number,
                :customer_address,
                :receipt_method_id,
                :remit_bank_acct_use_id,
                :account_name,
                :org_id,
                :salesrepId,
                :short_bank_name,
                :spacialNotes,
                :dpDate
              ) RETURNING id into :id`;
              
  const binds = Object.assign({}, context);

  binds.id = {
    dir: OracleDB.BIND_OUT,
    type: OracleDB.NUMBER,
  };

  const result = await simpleExecute(query, binds);

  binds.id = result.outBinds.id[0];
  return binds;
};

// update a money receipt
export const updateMoneyReceipt = async (context) => {
  let query = `UPDATE XX_MOBILE_MONEY_RECEIPT`;

  const binds = {};
  binds.id = context.id;

  const previousValueQuery = `SELECT attachment_url FROM XX_MOBILE_MONEY_RECEIPT WHERE ID = :id`;
  let previousValue = await simpleExecute(previousValueQuery, binds);

  if (previousValue.rows[0].ATTACHMENT_URL) {
    binds.attachment_url =
      previousValue.rows[0].ATTACHMENT_URL + ',' + context.attachment_url;
  } else {
    binds.attachment_url = context.attachment_url;
  }

  query += `\nSET ATTACHMENT_URL = :attachment_url`;
  query += `\nWHERE ID = :id`;

  const result = await simpleExecute(query, binds);
  return result.rowsAffected === 1;
};

export async function updateMrStatus(context) {
  let query = `UPDATE XX_MOBILE_MONEY_RECEIPT`;
  const binds = {};

  binds.money_receipt_id = context.money_receipt_id;
  binds.status = context.status;

  const lines = await getMoneyReceipt(context.money_receipt_id);

  query += `\nSET STATUS = :status`;
  query += `\nWHERE ID = :money_receipt_id`;

  const result = await simpleExecute(query, binds);
  return result.rowsAffected === 1 ? true : false;
}


export async function updateSingleMoneyReceipt(context) {
  let query = `UPDATE XX_MOBILE_MONEY_RECEIPT`;
  const binds = {};

  binds.form_deposit = context.form_deposit;
  binds.depositor_name = context.depositor_name;
  binds.depositor_phone = context.depositor_phone;
  binds.amount = context.amount;
  binds.remarks = context.remarks;
  binds.comments = context.comments;
  binds.spacialNotes = context.spacialNotes;
  binds.depositDate = context.depositDate;
  binds.mr_id = context.mr_id;
  
  if(context.mr_id){
    query += `\nSET
        AMOUNT = :amount,
        REMARKS = :remarks,
        FROM_DEPOSIT = :form_deposit,
        DEPOSITOR_NAME = :depositor_name,
        DEPOSITOR_PHONE = :depositor_phone,
        COMMENTS = :comments,
        SPACIAL_NOTES = :spacialNotes,
        DEPOSIT_DATE = :depositDate 
    WHERE ID = :mr_id`;
  }
  const result = await simpleExecute(query, binds);
  return result.rowsAffected === 1 ? true : false;
}
