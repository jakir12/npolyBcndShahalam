import OracleDB from 'oracledb';

import { simpleExecute } from '../services/database.js';

const baseOrderHeaderQuery = `SELECT 
      ORG_ID "orgId",
      MA_ORDER_ID "maOrderId",
      CUSTOMER_ID "customerId",
      CUSTOMER_NUMBER "customerNumber",
      CUSTOMER_NAME "customerName",
      BILL_TO_SITE "billToSite",
      SHIP_TO_SITE "shipToSite",
      ACTUAL_ADDRESS "actualDeliverySite",
      PRODUCT_CODE "productCode",
      PRODUCT_NAME "productName",
      CONTACT_PERSON "contactPerson",
      CONTACT_PHONE "contactPhone",
      PRICE_LIST_ID "priceListId",
      ORDER_TYPE_NAME "orderTypeName",
      ORDER_TYPE_ID "orderTypeId",
      SALESREP_NUMBER "salesrepNumber",
      SALESREP_NAME "salesrepName",
      ORDER_NOTES "orderNotes",
      CUSTOMER_PO "customerPo",
      PAYMENT_TYPE_CODE "paymentType",
      STATUS "status",
      CREATED_AT "createdAt",
      UPDATED_AT "updatedAt",
      DELIVERY_DATE "deliveryDate",
      DISCOUNT "orderDiscount"
    FROM 
      XX_MOBILE_ORDER_HEADERS`;

export async function getOrders(context) {
  let query = baseOrderHeaderQuery;
  const binds = {};
  
  if (context.created_by && context.customer_id) {
    binds.created_by = context.created_by;
    binds.customer_id = context.customer_id;

    query += `\nWHERE CUSTOMER_ID = :customer_id`;
    query += `\nAND CREATED_BY = :created_by`;
    query += `\nAND STATUS = 'INCOMPLETE'`;
    query += `\nORDER BY MA_ORDER_ID DESC`;
    query += `\nFETCH FIRST 10 ROWS ONLY`;
  } else if (context.created_by && context.status !== 'CANCELLED') {
    binds.created_by = context.created_by;
    binds.status = context.status;

    query += `\nWHERE CREATED_BY = :created_by`;
    query += `\nAND STATUS = :status`;
    query += `\nORDER BY MA_ORDER_ID DESC`;
    query += `\nFETCH FIRST 50 ROWS ONLY`;
  } else if (context.created_by && context.status === 'CANCELLED') {
    binds.created_by = context.created_by;
    binds.status1 = 'CANCELLED';
    binds.status2 = 'ERROR';
    binds.status3 = 'FAILED';
    binds.status4 = 'REJECTED';

    query += `\nWHERE CREATED_BY = :created_by`;
    query += `\nAND STATUS IN (:status1, :status2, :status3, :status4)`;
    query += `\nORDER BY MA_ORDER_ID DESC`;
    query += `\nFETCH FIRST 50 ROWS ONLY`;
  } else if (context.created_by) {
    binds.created_by = context.created_by;

    query += `\nWHERE CREATED_BY = :created_by`;
    query += `\nORDER BY MA_ORDER_ID DESC`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows.length === 0 ? null : result.rows;
}

export async function getLatestOrder(context) {
  let query = baseOrderHeaderQuery;
  const binds = {};
  
  if (context.created_by) {

    binds.created_by = context.created_by;
    binds.customer_id = context.customer_id;

    query += `\nWHERE CUSTOMER_ID = :customer_id`;
    query += `\nAND CREATED_BY = :created_by`;
    query += `\nAND STATUS = 'INCOMPLETE'`;
    query += `\nORDER BY MA_ORDER_ID DESC`;
    query += `\nFETCH FIRST 10 ROWS ONLY`;
  } 

  try{
    const result = await simpleExecute(query, binds);
    return result.rows.length === 0 ? null : result.rows;
  } catch (error) {
    return null;
  }
  
}

export async function getOrder(context) {
  let query = baseOrderHeaderQuery;
  const binds = {};

  if (context.ma_order_id) {
    binds.ma_order_id = context.ma_order_id;
    query += `\nWHERE MA_ORDER_ID = :ma_order_id`;
  }

  const result = await simpleExecute(query, binds);
  return result.rows.length === 0 ? null : result.rows[0];
}

const baseLineQuery = `SELECT
    MA_LINE_ID "maLineId",
    MA_ORDER_ID "maOrderId",
    INVENTORY_ITEM_ID "invItemId",
    ITEM_CODE "itemCode",
    DESCRIPTION "description",
    QTY "qty",
    GROSS_PRICE "grossPrice",
    NET_PRICE "netPrice",
    USER_ENTERED_PRICE "userEnteredPrice",
    DISCOUNT_PCT "discountPct",
    LINE_TOTAL_AMOUNT "lineTotalAmount",
    REMARKS "remarks"
  FROM 
    XX_MOBILE_ORDER_LINES`;

export async function getLines(context) {
  let query = baseLineQuery;

  const binds = {};

  if (context.ma_order_id) {
    binds.ma_order_id = context.ma_order_id;
    query += `\nWHERE MA_ORDER_ID = :ma_order_id`;
  }

  query += `\nORDER BY MA_LINE_ID`;

  const result = await simpleExecute(query, binds);

  return result.rows.length === 0 ? null : result.rows;
}

export async function getOneLine(context) {
  let query = baseLineQuery;

  const binds = {};

  if (context.ma_order_id && context.ma_line_id) {
    binds.ma_order_id = context.ma_order_id;
    binds.ma_line_id = context.ma_line_id;

    query += `\nWHERE MA_ORDER_ID = :ma_order_id`;
    query += `\nAND MA_LINE_ID = :ma_line_id`;
  }

  query += `\nORDER BY MA_LINE_ID`;

  const result = await simpleExecute(query, binds);

  return result.rows.length === 1 ? result.rows[0] : null;
}

const createOrderQuery = `INSERT INTO XX_MOBILE_ORDER_HEADERS 
(
  org_id,
  customer_id,
  customer_number,
  customer_name,
  customer_class,
  bill_to_site_id,
  bill_to_site,
  product_code,
  product_name,
  salesrep_id,
  salesrep_name,
  salesrep_number,
  ship_to_site_id,
  ship_to_site,
  order_type_id,
  order_type_name,
  price_list_id,
  price_list_name,
  warehouse_id,
  contact_person,
  contact_phone,
  actual_address,
  order_notes,
  combination_id,
  created_by,
  customer_po,
  division_id,
  division_name,
  payment_type_code,
  DELIVERY_DATE,
  DISCOUNT
) VALUES (
  :org_id,
  :customer_id,
  :customer_number,
  :customer_name,
  :customer_class,
  :bill_to_site_id,
  :bill_to_site,
  :product_code,
  :product_name,
  :salesrep_id,
  :salesrep_name,
  :salesrep_number,
  :ship_to_site_id,
  :ship_to_site,
  :order_type_id,
  :order_type_name,
  :price_list_id,
  :price_list_name,
  :warehouse_id,
  :contact_person,
  :contact_phone,
  :actual_address,
  :order_notes,
  :combination_id,
  :created_by,
  :customer_po,
  :division_id,
  :division_name,
  :payment_type_code,
  :delivery_date,
  :order_discount
) returning ma_order_id
  into :ma_order_id`;

export async function saveOrder(context) {
  let query;
  const orderObj = {};

  if (context.order_type_id && context.price_list_id) {
    orderObj.org_id = context.org_id;
    orderObj.customer_id = context.customer_id;
    orderObj.customer_number = context.customer_number;
    orderObj.customer_name = context.customer_name;
    orderObj.customer_class = context.customer_class;
    orderObj.bill_to_site_id = context.bill_to_site_id;
    orderObj.bill_to_site = context.bill_to_site;
    orderObj.product_code = context.product_code;
    orderObj.product_name = context.product_name;
    orderObj.salesrep_id = context.salesrep_id;
    orderObj.salesrep_name = context.salesrep_name;
    orderObj.salesrep_number = context.salesrep_number;
    orderObj.ship_to_site_id = context.ship_to_site_id;
    orderObj.ship_to_site = context.ship_to_site;
    orderObj.order_type_id = context.order_type_id;
    orderObj.order_type_name = context.order_type_name;
    orderObj.price_list_id = context.price_list_id;
    orderObj.price_list_name = context.price_list_name;
    orderObj.contact_person = context.contact_person;
    orderObj.contact_phone = context.contact_phone;
    orderObj.actual_address = context.actual_address;
    orderObj.order_notes = context.order_notes;
    orderObj.warehouse_id = context.warehouse_id;
    orderObj.combination_id = context.combination_id;
    orderObj.created_by = context.employee_number;
    orderObj.customer_po = context.customer_po;
    orderObj.division_id = context.division_id;
    orderObj.division_name = context.division_name;
    orderObj.payment_type_code = context.payment_type;
    orderObj.delivery_date = context.delivery_date;
    orderObj.order_discount = context.order_discount;
  }

  orderObj.ma_order_id = {
    dir: OracleDB.BIND_OUT,
    type: OracleDB.NUMBER,
  };
  query = createOrderQuery;

  const result = await simpleExecute(query, orderObj);

  orderObj.ma_order_id = result.outBinds.ma_order_id[0];

  if (orderObj.ma_order_id) {
    let query = baseOrderHeaderQuery;
    query += `\nWHERE ma_order_id = :ma_order_id`;
    const binds = {
      ma_order_id: orderObj.ma_order_id,
    };

    const result = await simpleExecute(query, binds);
    return result.rows.length === 0 ? null : result.rows[0];
  }
  return null;
}

const createOrderLine = `INSERT INTO XX_MOBILE_ORDER_LINES (
    ma_order_id,
    inventory_item_id,
    item_code,
    description,
    qty,
    uom,
    gross_price,
    currency,
    user_entered_price,
    net_price,
    discount_pct,
    line_total_amount,
    created_by,
    list_line_id,
    list_header_id,
    remarks) 
    VALUES (
    :ma_order_id,
    :inventory_item_id,
    :item_code,
    :description,
    :qty,
    :uom,
    :gross_price,
    :currency,
    :user_entered_price,
    :net_price,
    :discount_pct,
    :line_total_amount,
    :created_by,
    :list_line_id,
    :list_header_id,
    :remarks) returning ma_line_id into :ma_line_id`;

export async function saveOrderLine(context) {
  let query = createOrderLine;
  const obj = Object.assign({}, context);

  obj.ma_line_id = {
    dir: OracleDB.BIND_OUT,
    type: OracleDB.NUMBER,
  };

  const result = await simpleExecute(query, obj);

  obj.ma_line_id = result.outBinds.ma_line_id[0];
  return result.rowsAffected === 1 ? obj.ma_line_id : null;
}

export async function updateOne(context) {
  let query = `UPDATE XX_MOBILE_ORDER_LINES`;
  const obj = Object.assign({}, context);

  if (obj.ma_order_id && obj.ma_line_id) {
    query += `\nSET
        qty = :qty,
        user_entered_price = :user_entered_price,
        discount_pct = :discount_pct,
        line_total_amount = :line_total_amount,
        remarks = :remarks
    WHERE
        MA_ORDER_ID = :ma_order_id AND MA_LINE_ID = :ma_line_id`;
  }

  const result = await simpleExecute(query, obj);
  return result.rowsAffected === 1 ? obj.ma_line_id : null;
}

export async function addOrderAttachment(context) {
  let query = `UPDATE XX_MOBILE_ORDER_HEADERS`;

  const binds = {};
  binds.ma_order_id = context.ma_order_id;

  const previousValueQuery = `SELECT ORDER_ATTACHMENT FROM XX_MOBILE_ORDER_HEADERS WHERE MA_ORDER_ID = :ma_order_id`;
  const previousValue = await simpleExecute(previousValueQuery, binds);

  if (previousValue.rows[0].ORDER_ATTACHMENT) {
    binds.order_attachment =
      previousValue.rows[0].ORDER_ATTACHMENT + ',' + context.order_attachment;
  } else {
    binds.order_attachment = context.order_attachment;
  }

  query += `\nSET order_attachment = :order_attachment`;
  query += `\nWHERE ma_order_id = :ma_order_id`;

  const result = await simpleExecute(query, binds);
  return result.rowsAffected === 1 ? true : false;
}

export async function submitOrder(context) {
  let query = `UPDATE XX_MOBILE_ORDER_HEADERS`;
  const binds = {};

  binds.ma_order_id = context.ma_order_id;
  binds.status = context.status;

  const lines = await getLines(context.ma_order_id);

  query += `\nSET status = :status`;
  query += `\nWHERE ma_order_id = :ma_order_id`;

  const result = await simpleExecute(query, binds);
  return result.rowsAffected === 1 ? true : false;
}

export async function deleteOneLine(context) {
  let query = `DELETE FROM XX_MOBILE_ORDER_LINES`;
  const binds = {};

  binds.ma_order_id = context.ma_order_id;
  binds.ma_line_id = context.ma_line_id;

  query += `\nWHERE ma_order_id = :ma_order_id AND ma_line_id = :ma_line_id`;

  const result = await simpleExecute(query, binds);
  return result.rowsAffected === 1 ? true : false;
}

export async function updateOrder(context) {
  let query = `UPDATE XX_MOBILE_ORDER_HEADERS`;
  const binds = {};

  binds.ma_order_id = context.ma_order_id;
  binds.payment_type = context.payment_type;
  binds.contact_person = context.contact_person;
  binds.contact_phone = context.contact_phone;
  binds.actual_address = context.actual_address;
  binds.customer_po = context.customer_po;
  binds.order_notes = context.order_notes;
  binds.deliveryDate = context.deliveryDate;

  query += `\nSET PAYMENT_TYPE_CODE = :payment_type,
                  CONTACT_PERSON = :contact_person,
                  CONTACT_PHONE = :contact_phone,
                  ACTUAL_ADDRESS = :actual_address,
                  CUSTOMER_PO = :customer_po,
                  ORDER_NOTES = :order_notes,
                  DELIVERY_DATE = :deliveryDate
                  `;
                  
  query += `\nWHERE ma_order_id = :ma_order_id`;
  const result = await simpleExecute(query, binds);
  return result.rowsAffected === 1 ? true : false;
}
