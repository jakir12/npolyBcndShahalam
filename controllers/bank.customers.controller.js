// Customer Controllers for Bank Users to Fetch Customer List
// Author: Md. Jamal Uddin
// Date: 22-07-2022

import { findCustomerByCode, getCustomers } from '../db_apis/bank.customers.js';
import { SUCCESS } from '../utils/status.js';

export async function getAllCustomers(req, res, next) {
  try {
    const customers = await getCustomers();

    return res.status(200).json({ len: customers.length, data: customers });
  } catch (error) {
    return next(error);
  }
}

export async function getCustomerByCode(req, res, next) {
  try {
    const customer_code = req.params.code;
    const customer = await findCustomerByCode(customer_code);

    return res.status(200).json({ status: SUCCESS, customer });
  } catch (error) {
    return next(error);
  }
}
