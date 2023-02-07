// Money Receipt Routes for NpolySales Mobile App
// Npoly
// Date: 27-09-2022

import { Router } from 'express';
import { authProtection } from '../../controllers/mobile.auth.controller.js';
import {
  addMoneyReceipt,
  addMoneyReceiptAttachment,
  allMoneyReceipts,
  getOneMoneyReceipt,
  submitMoneyReceiptUpdate,
  updateMoneyReceiptLine
} from '../../controllers/mobile.mr.controller.js';

// this router hold all the money receipt related routes
const v1MoneyReceiptRouter = Router();

v1MoneyReceiptRouter.post(
  '/v1/mobile/money-receipt/all',
  authProtection,
  allMoneyReceipts
);

v1MoneyReceiptRouter.get(
  '/v1/mobile/money-receipt/:id',
  authProtection,
  getOneMoneyReceipt
);
v1MoneyReceiptRouter.post(
  '/v1/mobile/money-receipt',
  authProtection,
  addMoneyReceipt
);
v1MoneyReceiptRouter.patch(
  '/v1/mobile/money-receipt/attachment',
  authProtection,
  addMoneyReceiptAttachment
);

// update an order status by order id
v1MoneyReceiptRouter.patch(
  '/v1/mobile/money-receipt/status-update',
  authProtection,
  submitMoneyReceiptUpdate
);

v1MoneyReceiptRouter.patch(
  '/v1/mobile/money-receipt/update-all',
  authProtection,
  updateMoneyReceiptLine
);

export default v1MoneyReceiptRouter;
