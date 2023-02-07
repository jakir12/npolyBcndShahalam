import {
  customerBilling,
  customerShipping,
  getType,
} from '../db_apis/customers.js';
import {
  addOrderAttachment,
  deleteOneLine,
  getLines,
  getOneLine,
  getOrder,
  getOrders,
  saveOrder,
  saveOrderLine,
  submitOrder,
  updateOne,
  updateOrder,
  getLatestOrder
} from '../db_apis/mobile.orders.js';
import { FAILED, NOT_FOUND, SUCCESS } from '../utils/status.js';

// get all orders
export async function getAllOrders(req, res, next) {
  try {
    const context = {};

    const rows = await getOrders(context);

    return rows
      ? res.status(200).json({
          len: rows.length,
          data: rows,
        })
      : res.status(404).json({
          len: 0,
          data: [],
        });
  } catch (error) {
    return next(error);
  }
}

// get all orders by user
export async function getOrdersByUser(req, res, next) {
  try {
    const context = {};
    context.created_by = req.body.created_by;

    const rows = await getOrders(context);

    return rows
      ? res.status(200).json({
          len: rows.length,
          data: rows,
        })
      : res.status(404).json({
          len: 0,
          data: [],
        });
  } catch (error) {
    return next(error);
  }
}

// get latest 10 orders by user and customer
export async function getLatestOrders(req, res, next) {
  try {
    const context = {};
    context.created_by = req.body.created_by;
    context.customer_id = req.body.customer_id;
    const rows = await getLatestOrder(context);

    return rows
      ? res.status(200).json({
          len: rows.length,
          data: rows.map((row) => {
            const { maOrderId, customerId } = row;
            return {
              _id: `${maOrderId}_${customerId}`,
              value: `${maOrderId}`,
            };
          }),
        })
      : res.status(404).json({
          len: 0,
          data: [],
        });
  } catch (error) {
    return next(error);
  }
}

// get orders by status and user
export async function getOrderStatusByUser(req, res, next) {
  try {
    const context = {};
    context.created_by = req.body.created_by;
    context.status = req.body.status;

    const rows = await getOrders(context);

    return rows
      ? res.status(200).json({ len: rows.length, data: rows })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}

// get a single order by order id
export async function getOrderById(req, res, next) {
  try {
    const context = {};
    context.ma_order_id = parseInt(req.params.ma_order_id);

    const row = await getOrder(context);

    return row
      ? res.status(200).json({ message: SUCCESS, data: row })
      : res.status(404).json({ message: NOT_FOUND, data: {} });
  } catch (error) {
    return next(error);
  }
}

// get all lines for an order
export async function getOrderWiseLines(req, res, next) {
  try {
    const context = {};
    context.ma_order_id = parseInt(req.params.ma_order_id);

    const rows = await getLines(context);

    return rows
      ? res.status(200).json({ len: rows.length, data: rows })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}

// get a single line for an order
export async function getOrderSingleLine(req, res, next) {
  try {
    const context = {};
    context.ma_order_id = parseInt(req.body.ma_order_id);
    context.ma_line_id = parseInt(req.body.ma_line_id);

    const row = await getOneLine(context);

    return row
      ? res.status(200).json({ message: SUCCESS, data: row })
      : res.status(404).json({ message: NOT_FOUND, data: {} });
  } catch (error) {
    return next(error);
  }
}

// delete a line from an order
export async function deleteSingleLine(req, res, next) {
  try {
    const context = {};
    context.ma_order_id = parseInt(req.body.ma_order_id);
    context.ma_line_id = parseInt(req.body.ma_line_id);

    const rows = await deleteOneLine(context);

    return rows
      ? res.status(200).json({ status: SUCCESS, message: 'Line Item deleted' })
      : res.status(404).json({ status: FAILED, message: 'Failed to delete' });
  } catch (error) {
    return next(error);
  }
}
// create new order
export async function createOrder(req, res, next) {
  try {
    const context = {};
    context.customer_id = req.body.customer_id;

    const customerBill = await customerBilling({
      customer_id: context.customer_id,
    });

    if (customerBill === null) {
      return res
        .status(404)
        .json({ status: NOT_FOUND, message: 'Billing address not found' });
    }

    context.salesrep_number = req.body.salesrep_number;
    context.product_name = req.body.product_name;

    const customerShipment = await customerShipping({
      customer_id: context.customer_id,
      salesrep_number: context.salesrep_number,
      product_name: context.product_name,
    });

    if (!customerShipment) {
      return res
        .status(404)
        .json({ status: NOT_FOUND, message: 'Shipping address not found' });
    }

    const orderType = await getType({
      transaction_type_id: customerShipment.orderTypeId,
    });

    if (!orderType) {
      return res.status(404).json({
        status: NOT_FOUND,
        message: 'Customer Order Type not found',
      });
    }

    context.org_id = customerShipment.orgId;
    
    context.customer_id = customerShipment.customerId;
    context.customer_number = customerShipment.customerNumber;
    context.customer_name = customerShipment.customerName;
    context.customer_class = customerShipment.customerClass;
    context.bill_to_site_id = customerBill.billToSiteId;
    context.bill_to_site = customerBill.billToSite;
    context.ship_to_site_id = customerShipment.shipToSiteId;
    context.ship_to_site = customerShipment.shipToSite;
    context.product_code = customerShipment.productCode;
    context.product_name = customerShipment.productName;
    context.salesrep_id = customerShipment.salesrepId;
    context.salesrep_name = customerShipment.salesrepName;
    context.order_type_id = orderType.transactionTypeId;
    context.order_type_name = orderType.transactionTypeName;
    context.price_list_id = orderType.priceListId;
    context.price_list_name = orderType.priceListName;
    context.warehouse_id = customerShipment.warehouseId;
    context.combination_id = customerShipment.combinationId;
    context.customer_po = req.body.customer_po;
    context.contact_person = req.body.contact_person;
    context.contact_phone = req.body.contact_phone;
    context.actual_address = req.body.actual_address;
    context.order_notes = req.body.order_notes;
    context.employee_number = req.body.employee_number;
    context.division_id = customerShipment.divisionId;
    context.division_name = customerShipment.division;
    context.payment_type = req.body.payment_type;
    context.delivery_date = req.body.delivery_date === '' ? null : req.body.delivery_date;
    context.order_discount = req.body.order_discount === '' ? null : req.body.order_discount;

    const result = await saveOrder(context);

    return result
      ? res.json({ status: SUCCESS, data: result })
      : res
          .status(501)
          .json({ status: FAILED, message: 'Order creation failed.' });
  } catch (error) {
    return next(error);
  }
}

const orderLineFromReq = (req) => {
  const newLine = {
    ma_order_id: parseInt(req.body.ma_order_id),
    inventory_item_id: parseInt(req.body.inventory_item_id),
    item_code: req.body.item_code,
    description: req.body.description,
    qty: parseInt(req.body.qty),
    uom: req.body.uom,
    gross_price: req.body.gross_price,
    currency: req.body.currency,
    user_entered_price: parseFloat(req.body.user_entered_price),
    net_price: parseFloat(req.body.net_price),
    discount_pct: parseFloat(req.body.discount_pct),
    line_total_amount: parseFloat(req.body.line_total_amount),
    created_by: req.body.created_by,
    list_line_id: parseInt(req.body.list_line_id),
    list_header_id: parseInt(req.body.list_header_id),
    remarks: req.body.remarks,
  };
  return newLine;
};

// create new line for an order
export async function createOrderLine(req, res, next) {
  try {
    const orderLine = orderLineFromReq(req);

    const result = await saveOrderLine(orderLine);
    return result
      ? res.status(200).json({ status: SUCCESS, data: result })
      : res
          .status(501)
          .json({ status: FAILED, message: 'Order line creation failed.' });
  } catch (error) {
    return next(error);
  }
}

// upload order attachment
export async function uploadOrderAttachment(req, res, next) {
  try {
    const context = {};
    context.ma_order_id = parseInt(req.body.ma_order_id);
    context.order_attachment = req.body.order_attachment;

    const result = await addOrderAttachment(context);

    return result
      ? res.json({
          status: SUCCESS,
          message: 'Order attachment successfully uploaded',
        })
      : res.status(404).json({
          status: FAILED,
          message: 'Order attachment failed to upload',
        });
  } catch (error) {
    return next(error);
  }
}

// update an order status from incomplete / re-assign to draft by user submission
export async function submitOrderFromUser(req, res, next) {
  try {
    const context = {};
    context.ma_order_id = parseInt(req.body.ma_order_id);
    context.status = req.body.status;

    const result = await submitOrder(context);

    return result
      ? res.json({
          status: SUCCESS,
          message: 'Order status successfully changed',
        })
      : res
          .status(404)
          .json({ status: FAILED, message: 'Order status update failed' });
  } catch (error) {
    return next(error);
  }
}

export async function updateOrderLine(req, res, next) {
  try {
    const context = {};
    context.ma_order_id = parseInt(req.body.ma_order_id);
    context.ma_line_id = parseInt(req.body.ma_line_id);
    context.qty = parseInt(req.body.qty);
    context.user_entered_price = parseFloat(req.body.user_entered_price);
    context.discount_pct = parseFloat(req.body.discount_pct);
    context.line_total_amount = parseFloat(req.body.line_total_amount);
    context.remarks = req.body.remarks;

    const result = await updateOne(context);

    return result !== null
      ? res.json({ status: SUCCESS, result })
      : res
          .status(404)
          .json({ status: FAILED, message: 'Order line not updated' });
  } catch (error) {
    return next(error);
  }
}

// update an order status from incomplete / re-assign to draft by user submission
export async function updateOrderContact(req, res, next) {
  try {
    const context = {};

    context.ma_order_id = parseInt(req.body.ma_order_id);
    context.payment_type = req.body.payment_type;
    context.customer_po = req.body.customer_po;
    context.contact_person = req.body.contact_person;
    context.contact_phone = req.body.contact_phone;
    context.actual_address = req.body.actual_address;
    context.order_notes = req.body.order_notes;
    context.deliveryDate = req.body.deliveryDate;

    const result = await updateOrder(context);

    return result
      ? res.json({
          status: SUCCESS,
          message: 'Order status successfully changed',
        })
      : res
          .status(404)
          .json({ status: FAILED, message: 'Order status update failed' });
  } catch (error) {
    return next(error);
  }
}
