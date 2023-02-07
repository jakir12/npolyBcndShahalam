// Product Category Controllers for Npoly Sales Mobile App
// Author: Md. Jamal Uddin
// Date: 29-07-2022

import {
  minorCategories,
  motherCategories,
  productTypes,
  subCategories,
} from '../db_apis/categories.js';

export async function getAllProductTypes(req, res, next) {
  try {
    const context = {};

    const rows = await productTypes(context);

    return rows
      ? res.status(200).json({ len: rows.length, data: rows })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}

export async function getCustomerProductTypes(req, res, next) {
  try {
    const context = {};

    if (req.body.customer_id && req.body.salesrep_number) {
      context.customer_id = req.body.customer_id;
      context.salesrep_number = req.body.salesrep_number;
    }

    if (req.body.customer_id) {
      context.customer_id = req.body.customer_id;
    }

    const rows = await productTypes(context);

    return rows
      ? res.status(200).json({ len: rows.length, data: rows })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}

export async function getMotherCategories(req, res, next) {
  try {
    const context = {};
    context.product_name = req.body.product_name;

    const rows = await motherCategories(context);

    // manually added trading category for all product types
    return rows
      ? res.status(200).json({
          len: rows.length,
          data: [...rows, { motherCategory: 'Trading' }],
        })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}

export async function getSubCategories(req, res, next) {
  try {
    const context = {};
    context.mother_category = req.body.mother_category;

    const rows = await subCategories(context);

    return rows
      ? res.status(200).json({ len: rows.length, data: rows })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}

export async function getMinorCategories(req, res, next) {
  try {
    const context = {};
    context.product_type = req.body.product_type;
    context.mother_category = req.body.mother_category;
    context.sub_major_category = req.body.sub_major_category;

    const rows = await minorCategories(context);

    return rows
      ? res.status(200).json({ len: rows.length, data: rows })
      : res.status(404).json({ len: 0, data: [] });
  } catch (error) {
    return next(error);
  }
}
