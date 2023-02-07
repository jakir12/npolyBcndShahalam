import { Router } from 'express';
import { authProtection } from '../../controllers/mobile.auth.controller.js';
import {
  createOrder,
  createOrderLine,
  deleteSingleLine,
  getAllOrders,
  getLatestOrders,
  getOrderById,
  getOrdersByUser,
  getOrderSingleLine,
  getOrderStatusByUser,
  getOrderWiseLines,
  submitOrderFromUser,
  updateOrderContact,
  updateOrderLine,
  uploadOrderAttachment,
} from '../../controllers/mobile.orders.controller.js';

const v1MobileOrdersRouter = Router();

// create a new order
v1MobileOrdersRouter.post(
  '/v1/mobile/sales/orders/create',
  authProtection,
  createOrder
);
// get all orders
v1MobileOrdersRouter.get(
  '/v1/mobile/sales/orders',
  authProtection,
  getAllOrders
);
// get all orders by user
v1MobileOrdersRouter.post(
  '/v1/mobile/sales/orders',
  authProtection,
  getOrdersByUser
);
// get latest 10 orders by user and customer
v1MobileOrdersRouter.post(
  '/v1/mobile/sales/orders/latest',
  authProtection,
  getLatestOrders
);
// get all orders by user and status
v1MobileOrdersRouter.post(
  '/v1/mobile/sales/orders/status',
  authProtection,
  getOrderStatusByUser
);
// get order by id
v1MobileOrdersRouter.get(
  '/v1/mobile/sales/orders/:ma_order_id',
  authProtection,
  getOrderById
);
// get order lines by order id
v1MobileOrdersRouter.get(
  '/v1/mobile/sales/:ma_order_id/lines',
  authProtection,
  getOrderWiseLines
);
// get a single line by order id and line id
v1MobileOrdersRouter.post(
  '/v1/mobile/sales/orders/lines/line',
  authProtection,
  getOrderSingleLine
);
// delete a single line by order id and line id
v1MobileOrdersRouter.delete(
  '/v1/mobile/sales/orders/lines/line',
  authProtection,
  deleteSingleLine
);
// create a new line by order id
v1MobileOrdersRouter.post(
  '/v1/mobile/sales/orders/lines/line/create',
  authProtection,
  createOrderLine
);
// upload an image as an order attachment
v1MobileOrdersRouter.patch(
  '/v1/mobile/sales/orders/upload/order/attachment',
  authProtection,
  uploadOrderAttachment
);
// update an order status by order id
v1MobileOrdersRouter.patch(
  '/v1/mobile/sales/orders/submit',
  authProtection,
  submitOrderFromUser
);
// update order line by order id and line id
v1MobileOrdersRouter.patch(
  '/v1/mobile/sales/orders/lines/line',
  authProtection,
  updateOrderLine
);

// update an order contact by order id
v1MobileOrdersRouter.patch(
  '/v1/mobile/sales/orders/update',
  authProtection,
  updateOrderContact
);

export { v1MobileOrdersRouter };
