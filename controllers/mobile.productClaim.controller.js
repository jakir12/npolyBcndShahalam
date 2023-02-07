
  import {
    getProductClaims,
    saveProductComplain,
  } from '../db_apis/mobile.productClaim.js';

  import { FAILED, NOT_FOUND, SUCCESS } from '../utils/status.js';
  
  // get all orders
  export async function getAllProClaims(req, res, next) {
    try {
      const context = {};
      context.created_by = req.body.created_by;
      const rows = await getProductClaims(context);
  
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

  // create new order
  export async function createProductClaims(req, res, next) {
    try {

      const context = {};
      
      context.customerId = req.body.customerId;
      context.customerNumber = req.body.customerNumber;
      context.customerName = req.body.customerName;
      context.invItemId = req.body.invItemId;
      context.itemCode = req.body.itemCode;
      context.description = req.body.description;
      context.grossPrice = req.body.grossPrice;
      context.claimQty = req.body.claimQty;
      context.claimReason = req.body.claimReason;
      context.valueOfClaim = req.body.valueOfClaim;
      context.challanNum = req.body.challanNum;
      context.claimDate = req.body.claimDate;
      context.created_by = req.body.created_by;
      context.status = "PENDING";
      context.remarks = req.body.remarks;
      
      const result = await saveProductComplain(context);
      return result
        ? res.json({ status: SUCCESS, data: result })
        : res
            .status(501)
            .json({ status: FAILED, message: 'Product Claim creation failed.' });
    } catch (error) {
      return next(error);
    }
  }
  