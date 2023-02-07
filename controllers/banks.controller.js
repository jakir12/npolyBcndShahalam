import { get, getById } from '../db_apis/banks.js';
import { NOT_FOUND, SUCCESS } from '../utils/status.js';

export const banks = async (req, res) => {
  
  const context = {};
  if(req.body.org_id){
    context.org_id = req.body.org_id;
  }else{
    context.org_id = 101;
  }
  
  const banks = await get(context);

  res.status(200).json(banks);
};

export const bank = async (req, res) => {
  const { id } = req.params;

  const bank = await getById(id);

  bank
    ? res.status(200).json({ data: bank, message: SUCCESS })
    : res.status(404).json({ data: {}, message: NOT_FOUND });
};


export const formattedBanks = async (req, res) => {

  const rows = await get();

  return rows
      ? res.status(200).json({
          len: rows.length,
          data: rows.map((row) => {
            const { id,title, account_name,bank_account_number,branch_name } = row;
            return {
              _id: `${id}`,
              value: `${id}-\n${account_name}`,
            };
          }),
        })
      : res.status(404).json({
          len: 0,
          data: [],
        });


  res.status(200).json(banks);
};