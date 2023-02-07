import { simpleExecute } from '../services/database.js';

const shippingBaseQuery = `SELECT
                            ORG_ID "orgId",
                            CUSTOMER_ID "customerId",
                            ACCOUNT_NUMBER "customerNumber",
                            CUSTOMER_PHONE_NO "customerPhone",
                            ACCOUNT_NAME "customerName",
                            CUSTOMER_CLASS_CODE "customerClass",
                            SITE_USE_ID "shipToSiteId",
                            ADDRESS1 "shipToSite",
                            PRODUCT_CODE "productCode",
                            PRODUCT_NAME "productName",
                            ORDER_TYPE_ID "orderTypeId",
                            SALESREP_ID "salesrepId",
                            SALESREP_NUMBER "salesrepNumber",
                            SALESREP_NAME "salesrepName",
                            WAREHOUSE_ID "warehouseId",
                            COMBINATION_ID "combinationId",
                            DIV_ID "divisionId",
                            DIVISION "division"
                        FROM APPS.XX_CUSTOMER_SHIPPING_DETAILS@SALES`;

// sales person wise all customers shipping details
export async function customersShipping(context) {
  let query = shippingBaseQuery;
  const binds = {};

  if (context.salesrep_number) {
    binds.salesrep_number = context.salesrep_number;

    query += `\nWHERE SALESREP_NUMBER = :salesrep_number`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows.length > 0 ? result.rows : null;
}

// single customer shipping info
export async function customerShipping(context) {
  let query = shippingBaseQuery;
  const binds = {};

  if (context.salesrep_number && context.customer_id && context.product_name) {
    
    binds.salesrep_number = context.salesrep_number;
    binds.customer_id = context.customer_id;
    binds.product_name = context.product_name;
    
    query += `\nWHERE SALESREP_NUMBER = :salesrep_number AND CUSTOMER_ID = :customer_id AND PRODUCT_NAME = :product_name`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows.length === 1 ? result.rows[0] : null;
}

const customerBillingQuery = `SELECT
    SITE_USE_ID "billToSiteId",
    ADDRESS1 "billToSite" 
  FROM APPS.XX_CUSTOMER_BILLING_DETAILS@SALES`;

// get single customer billing info
export async function customerBilling(context) {
  let query = customerBillingQuery;
  const binds = {};

  if (context.customer_id) {
    binds.customer_id = context.customer_id;
    query += `\nWHERE CUSTOMER_ID = :customer_id`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows.length === 1 ? result.rows[0] : null;
}

const orderTypeQuery = `SELECT DISTINCT
    TRANSACTION_TYPE_ID "transactionTypeId",
    TRANSACTION_TYPE_NAME "transactionTypeName",
    PRICE_LIST_ID "priceListId", 
    PRICE_LIST_NAME "priceListName"
  FROM APPS.XXOE_TRANSACTION_TYPES_V1@SALES`;

// get single customer order type and price list
export async function getType(context) {
  let query = orderTypeQuery;
  const binds = {};

  if (context.transaction_type_id) {
    binds.transaction_type_id = context.transaction_type_id;

    query += `\nWHERE TRANSACTION_TYPE_ID = :transaction_type_id`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows.length === 1 ? result.rows[0] : null;
}
