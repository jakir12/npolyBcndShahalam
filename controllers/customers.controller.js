import {
  customerBilling,
  customerShipping,
  customersShipping,
  getType,
} from '../db_apis/customers.js';
import { NOT_FOUND, SUCCESS } from '../utils/status.js';

// sales person wise all customers shipping details
export async function getCustomersShippingBySR(req, res, next) {
  try {
    const context = {};

    context.salesrep_number = req.body.salesrep_number;
    
    const customers = await customersShipping(context);

    return customers
      ? res.status(200).json({ len: customers.length, data: customers })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    next(error);
  }
}

// single customer shipping info by salesrep_number, customer_id and product_name
export async function getCustomerShipping(req, res, next) {
  try {
    const context = {};

    context.salesrep_number = req.body.salesrep_number;
    context.customer_id = req.body.customer_id;
    context.product_name = req.body.product_name;

    if(context.salesrep_number && context.customer_id && context.product_name){
      const customer = await customerShipping(context);
      
      return customer
        ? res.status(200).json({ status: SUCCESS, data: customer })
        : res.status(404).json({ status: NOT_FOUND, data: {} });
    }else{
      res.status(404).json({ status: NOT_FOUND, data: {} });
    }
    
  } catch (error) {
    next(error);
  }
}

// get customers billing info by customer id
export async function getCustomerBilling(req, res, next) {
  try {
    const context = {};
    context.customer_id = req.body.customer_id;

    const customer = await customerBilling(context);
    return customer
      ? res.status(200).json({ status: SUCCESS, data: customer })
      : res.status(404).json({ status: NOT_FOUND, data: {} });
  } catch (error) {
    next(error);
  }
}

// get customer order type and price list
export async function getCustomerOrderType(req, res, next) {
  try {
    const context = {};

    context.transaction_type_id = req.body.transaction_type_id;

    const result = await getType(context);
    return result
      ? res.status(200).json({ status: SUCCESS, data: result })
      : res.status(404).json({ status: NOT_FOUND, data: {} });
  } catch (error) {
    next(error);
  }
}

// get latest 10 orders by user and customer
export async function getCustomerFormatterValue(req, res, next) {
  try {
    const context = {};
    context.salesrep_number = req.body.salesrep_number;

    const rows = await customersShipping(context);
    
    return rows
    ? res.status(200).json({
        len: rows.length,
        data: rows.map((row) => {
          const { customerId, customerNumber,customerName,productName } = row;
          return {
            _id: `${customerId}_${productName}`,
            value: `${customerId}-\n${customerName}-${productName}`,
          };
        }),
      })
    : res.status(404).json({
        len: 0,
        data: [],
      });
  } catch (error) {
    next(error);
  }
}
