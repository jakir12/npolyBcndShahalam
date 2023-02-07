import { Router } from 'express';
import { simpleExecute } from '../../services/database.js';

import { authProtection } from '../../controllers/mobile.auth.controller.js';

const v1CommonRouter = Router();

v1CommonRouter.get('/v1/db/', authProtection, async (req, res) => {
  const result = await simpleExecute('select user, systimestamp from dual');
  const user = result.rows[0].USER;
  const date = result.rows[0].SYSTIMESTAMP;

  res.json({ dbUser: user, date: date });
});

export { v1CommonRouter };
