import { Router } from 'express';
import {
  getCustomerBilling,
  getCustomerOrderType,
  getCustomerShipping,
  getCustomersShippingBySR,
  getCustomerFormatterValue
} from '../../controllers/customers.controller.js';

import { authProtection } from '../../controllers/mobile.auth.controller.js';

const v1CustomersRouter = Router();

// sales person wise all customers shipping details
v1CustomersRouter.post(
  '/v1/customers/sales/shipping',
  authProtection,
  getCustomersShippingBySR
);
// single customer shipping info
v1CustomersRouter.post(
  '/v1/customers/customer/shipping',
  authProtection,
  getCustomerShipping
);
// customer bill to site info
v1CustomersRouter.post(
  '/v1/customers/customer/billing',
  authProtection,
  getCustomerBilling
);
// single customer order type and price list
v1CustomersRouter.post(
  '/v1/customers/customer/order-type',
  authProtection,
  getCustomerOrderType
);

v1CustomersRouter.post(
  '/v1/customers/formatted-value',
  authProtection,
  getCustomerFormatterValue
);

export { v1CustomersRouter };
