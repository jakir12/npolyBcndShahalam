import OracleDB from 'oracledb';

import { simpleExecute } from '../services/database.js';

const baseOrderHeaderQuery = `SELECT 
      COMPLAIN_ID "complainId",
      CUSTOMER_ID "customerId",
      CUSTOMER_NUMBER "customerNumber",
      CUSTOMER_NAME "customerName",
      ITEM_ID "itemId",
      ITEM_CODE "itemCode",
      ITEM_NAME "itemName",
      GROSS_PRICE "grossPrice",
      CLAIM_QUANTITY "claimQty",
      CLAIM_REASON "claimReason",
      VALUE_OF_CLAIM "valueOfClaim",
      CHALLAN_NUMBER "challanNumber",
      CLAIM_DATE "claimDate",
      CREATED_BY "createdBy",
      REMARKS "remarks"

    FROM 
    XX_PRODUCT_COMPLAINS`;

export async function getProductClaims(context) {
  let query = baseOrderHeaderQuery;
  const binds = {};
  
  if (context.created_by) {
    binds.created_by = context.created_by;
   
    query += `\nWHERE CREATED_BY = :created_by`;
    query += `\nORDER BY COMPLAIN_ID DESC`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows.length === 0 ? null : result.rows;
}

const baseLineQuery = `SELECT
        CUSTOMER_ID "customerId",
        CUSTOMER_NUMBER "customerNumber",
        CUSTOMER_NAME "customerName",
        ITEM_ID "itemId",
        ITEM_CODE "itemCode",
        ITEM_NAME "itemName",
        GROSS_PRICE "grossPrice",
        CLAIM_QUANTITY "claimQty",
        CLAIM_REASON "claimReason",
        VALUE_OF_CLAIM "valueOfClaim",
        CHALLAN_NUMBER "challanNumber",
        CLAIM_DATE "claimDate",
        CREATED_BY "createdBy",
        REMARKS "remarks"
        FROM 
        XX_PRODUCT_COMPLAINS`;

export async function getSingleClaims(context) {
  let query = baseLineQuery;

  const binds = {};

  if (context.complain_id) {
    binds.complain_id = context.complain_id;
    query += `\nWHERE COMPLAIN_ID = :complain_id`;
  }

  query += `\nORDER BY COMPLAIN_ID`;

  const result = await simpleExecute(query, binds);

  return result.rows.length === 0 ? null : result.rows;
}


const createClaimQuery = `INSERT INTO XX_PRODUCT_COMPLAINS 
(
CUSTOMER_ID,
CUSTOMER_NUMBER,
CUSTOMER_NAME,
ITEM_ID,
ITEM_CODE,
ITEM_NAME,
GROSS_PRICE,
CLAIM_QUANTITY,
CLAIM_REASON,
VALUE_OF_CLAIM,
CHALLAN_NUMBER,
CLAIM_DATE,
CREATED_BY,
STATUS,
REMARKS
) VALUES (
  :customerId,
  :customerNumber,
  :customerName,
  :invItemId,
  :itemCode,
  :description,
  :grossPrice,
  :claimQty,
  :claimReason,
  :valueOfClaim,
  :challanNum,
  :claimDate,
  :created_by,
  :status,
  :remarks
) returning complain_id
  into :complain_id`;

export async function saveProductComplain(context) {
  let query;
  const orderObj = {};

  if (context.customerId && context.invItemId) {
    orderObj.customerId = context.customerId;
    orderObj.customerNumber = context.customerNumber;
    orderObj.customerName = context.customerName;
    orderObj.invItemId = context.invItemId;
    orderObj.itemCode = context.itemCode;
    orderObj.description = context.description;
    orderObj.grossPrice = context.grossPrice;
    orderObj.claimQty = context.claimQty;
    orderObj.claimReason = context.claimReason;
    orderObj.valueOfClaim = context.valueOfClaim;
    orderObj.challanNum = context.challanNum;
    orderObj.claimDate = context.claimDate;
    orderObj.created_by = context.created_by;
    orderObj.status = context.status;
    orderObj.remarks = context.remarks;
  }

  orderObj.complain_id = {
    dir: OracleDB.BIND_OUT,
    type: OracleDB.NUMBER,
  };
  query = createClaimQuery;
  const result = await simpleExecute(query, orderObj);

  orderObj.complain_id = result.outBinds.complain_id[0];

  if (orderObj.complain_id) {
    let query = baseOrderHeaderQuery;
    query += `\nWHERE complain_id = :complain_id`;
    const binds = {
        complain_id: orderObj.complain_id,
    };

    const result = await simpleExecute(query, binds);
    return result.rows.length === 0 ? null : result.rows[0];
  }
  return null;
}
