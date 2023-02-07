import {
  createMoneyReceipt,
  getMoneyReceipt,
  getMoneyReceipts,
  updateMoneyReceipt,
  updateMrStatus,
  updateSingleMoneyReceipt,
} from '../db_apis/mobile.mr.js';


import {
  customerShipping
} from '../db_apis/customers.js';
import { getSingleBank } from '../db_apis/banks.js';

import { FAILED, NOT_FOUND, SUCCESS } from '../utils/status.js';

export const addMoneyReceipt = async (req, res) => {
  try {
    const context = {};
    context.customer_id = req.body.customer_id;
    context.product_name = req.body.product_name;
    context.bank_id = req.body.bank_id;
    context.bank_name = req.body.bank_name;
    context.branch_name = req.body.branch_name;
    context.bank_account_number = req.body.bank_account_number;
    context.form_deposit = req.body.form_deposit;
    context.depositor_name = req.body.depositor_name;
    context.depositor_phone = req.body.depositor_phone;
    context.amount = req.body.amount;
    context.remarks = req.body.remarks;
    context.comments = req.body.comments;
    context.created_by = req.body.created_by;
    context.order_ids = 'N/A';
    context.customer_name = req.body.customer_name;
    context.customer_number = req.body.customer_number;
    context.customer_address = req.body.customer_address;
    context.receipt_method_id = req.body.receipt_method_id;
    context.remit_bank_acct_use_id = req.body.remit_bank_acct_use_id;
    context.account_name = req.body.account_name;
    context.org_id = req.body.org_id;
    context.salesrepId = req.body.salesrepId;
    context.short_bank_name = req.body.short_bank_name;
    context.dpDate = req.body.date;
    context.spacialNotes = req.body.spacialNotes;
    
    const result = await createMoneyReceipt(context);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// get all money receipts by created_by or created_by and customer_id
export const allMoneyReceipts = async (req, res) => {
  try {
    const context = {};
    context.created_by = req.body.created_by;
    context.status = req.body.status;

    const result = await getMoneyReceipts(context);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// get a single money receipt by id
export const getOneMoneyReceipt = async (req, res) => {
  try {
    const context = {};
    context.money_receipt_id = req.params.id;

    const result = await getMoneyReceipt(context);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// add attachment to a money receipt
export const addMoneyReceiptAttachment = async (req, res, next) => {
  try {
    const context = {};
    context.id = req.body.money_receipt_id;
    context.attachment_url = req.body.attachment_url;

    const result = await updateMoneyReceipt(context);

    return result
      ? res.json({
          status: SUCCESS,
          message: 'Money Receipt Attachment successfully uploaded',
        })
      : res.status(404).json({
          status: FAILED,
          message: 'Money Receipt Attachment failed to upload',
        });
  } catch (err) {
    return next(err);
  }
};

// update an order status from incomplete / re-assign to draft by user submission
export async function submitMoneyReceiptUpdate(req, res, next) {
  try {
    const context = {};
    context.money_receipt_id = parseInt(req.body.money_receipt_id);
    context.status = req.body.status;

    const result = await updateMrStatus(context);

    return result
      ? res.json({
          status: SUCCESS,
          message: 'Status successfully changed',
        })
      : res
          .status(404)
          .json({ status: FAILED, message: 'Status update failed' });
  } catch (error) {
    return next(error);
  }
}


export async function updateMoneyReceiptLine(req, res, next) {
  try {
    const context = {};

    context.form_deposit = req.body.form_deposit;
    context.depositor_name = req.body.depositor_name;
    context.depositor_phone = req.body.depositor_phone;
    context.amount = parseFloat(req.body.amount);
    context.remarks = req.body.remarks;
    context.comments = req.body.comments;
    context.spacialNotes = req.body.spacialNotes;
    context.depositDate = req.body.depositDate;
    context.mr_id = req.body.mr_id;

    const result = await updateSingleMoneyReceipt(context);

    return result !== null
      ? res.json({ status: SUCCESS, result })
      : res
          .status(404)
          .json({ status: FAILED, message: 'Money Receipt not updated' });
  } catch (error) {
    return next(error);
  }
}