import { simpleExecute } from '../services/database.js';

const prodTypeBaseQuery = `SELECT DISTINCT
    b.PRODUCT_CODE "productCode", 
    b.PRODUCT_NAME "productName"
  FROM APPS.XX_AR_CUSTOMERS_ALL_V@SALES a,
       APPS.XX_CUSTTERRSRZMDM_V@SALES b
WHERE b.CUSTOMER_ID = a.CUSTOMER_ID
    AND END_DATE_ACTIVE IS NULL`;

export async function productTypes(context) {
  let query = prodTypeBaseQuery;
  const binds = {};

  if (context.salesrep_number && context.customer_id) {
    binds.salesrep_number = context.salesrep_number;
    binds.customer_id = context.customer_id;
    query += `\nAND b.SALESREP_NUMBER = :salesrep_number
              AND a.CUSTOMER_ID = :customer_id`;
  }

  if (context.customer_id) {
    query += `\nAND a.CUSTOMER_ID = :customer_id`;
    binds.customer_id = context.customer_id;
  }

  query += `\nORDER BY PRODUCT_CODE ASC`;

  const result = await simpleExecute(query, binds);
  return result.rows && result.rows.length > 0 ? result.rows : null;
}

const motherCatBaseQuery = `SELECT DISTINCT MOTHER_CATEGORY "motherCategory"
  FROM (SELECT KFV.ATTRIBUTE10 MOTHER_CATEGORY,
               CASE
                  WHEN KFV.ATTRIBUTE10 IN ('Cable Casing',
                                           'Corrugated Pipe',
                                           'CPVC Fittings',
                                           'CPVC Pipe',
                                           'Garden Hose Pipe',
                                           'HDPE PE-100 Pipe',
                                           'HDPE Pipe & Fittings',
                                           'PPR Fittings',
                                           'PPR Pipe',
                                           'Solvent Cement',
                                           'Suction Hose Pipe',
                                           'Teflon Tape',
                                           'uPVC Fittings (SWR)',
                                           'uPVC Fittings (Thread)',
                                           'uPVC Pipe',
                                           'uPVC Pipe 1.5" Group',
                                           'Fittings Compound',
                                           'BTL Compound')
                  THEN
                     'Pipe'
                  WHEN KFV.ATTRIBUTE10 LIKE 'HDPE Pipe%'
                  THEN
                     'Pipe'
                  WHEN KFV.ATTRIBUTE10 IN ('Household')
                       AND KFV.ORGANIZATION_ID=101
                  THEN
                     'Pipe'
                  WHEN KFV.ATTRIBUTE10 IN ('PVC Ceiling Board',
                                           'PVC Door',
                                           'PVC Door Accessories',
                                           'PVC Sheet',
                                           'Packaging & Accessories')
                  THEN
                     'Door'
                  WHEN KFV.ATTRIBUTE10 IN ('Water Tank')
                  THEN
                     'Tank'
                  WHEN KFV.ATTRIBUTE10 IN ('Water Tap')
                  THEN
                     'Water Tap'
                  WHEN KFV.ATTRIBUTE10 IN ('Furniture')
                  THEN
                     'Furniture'
                  WHEN KFV.ATTRIBUTE10 IN ('Household')
                  THEN
                     'Household'
                  ELSE
                     NULL
               END
                  AS product_name
          FROM apps.MTL_SYSTEM_ITEMS_KFV@SALES KFV,
               apps.MTL_ITEM_CATEGORIES@SALES MIC,
               apps.MTL_CATEGORIES@SALES MC
         WHERE     MIC.ORGANIZATION_ID = KFV.ORGANIZATION_ID
               AND MIC.INVENTORY_ITEM_ID = KFV.INVENTORY_ITEM_ID
               AND MIC.CATEGORY_ID = MC.CATEGORY_ID
               AND MC.STRUCTURE_ID = 101
               AND KFV.ATTRIBUTE10 IS NOT NULL
               AND MC.SEGMENT1 IN ('FINISHED GOODS', 'TRADING'))`;

export async function motherCategories(context) {
  let query = motherCatBaseQuery;
  const binds = {};

  if (context.product_name) {
    binds.product_name = context.product_name;
    query += '\nWHERE product_name = :product_name';
  }

  const result = await simpleExecute(query, binds);
  return result.rows.length > 0 ? result.rows : null;
}

export async function subCategories(context) {
  let query = `SELECT DISTINCT b.segment2 "subMajorCategory"
  FROM MTL_SYSTEM_ITEMS_KFV@SALES a, MTL_ITEM_CATEGORIES_V@SALES b
 WHERE     a.INVENTORY_ITEM_ID = b.INVENTORY_ITEM_ID
       AND a.ORGANIZATION_ID = b.ORGANIZATION_ID`;
  const binds = {};

  if (context.mother_category) {
    binds.mother_category = context.mother_category;
    query += '\nAND a.ATTRIBUTE10 = :mother_category';
  }

  const result = await simpleExecute(query, binds);
  return result.rows ? result.rows : null;
}

export async function minorCategories(context) {
  let query = `SELECT DISTINCT b.SEGMENT3 "minorCategory"
    FROM MTL_SYSTEM_ITEMS_KFV@SALES a, MTL_ITEM_CATEGORIES_V@SALES b
   WHERE a.INVENTORY_ITEM_ID = b.INVENTORY_ITEM_ID
         AND a.ORGANIZATION_ID = b.ORGANIZATION_ID`;
  const binds = {};

  if (context.mother_category && context.sub_major_category) {
    binds.mother_category = context.mother_category;
    binds.sub_major_category = context.sub_major_category;

    query +=
      '\nAND a.ATTRIBUTE10 = :mother_category AND b.SEGMENT2= :sub_major_category';
  }

  const result = await simpleExecute(query, binds);
  return result.rows ? result.rows : null;
}
