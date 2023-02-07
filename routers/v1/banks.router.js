import { Router } from 'express';
import { bank, banks,formattedBanks } from '../../controllers/banks.controller.js';
import { authProtection } from '../../controllers/mobile.auth.controller.js';

const v1BankRouter = Router();

v1BankRouter.post('/v1/bank/all', authProtection, banks);
v1BankRouter.get('/v1/bank/formatted', authProtection, formattedBanks);
v1BankRouter.get('/v1/bank/:id', authProtection, bank);

export { v1BankRouter };
