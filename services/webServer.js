import express, { json } from 'express';
import { createServer } from 'http';
import morgan from 'morgan';

// web server config
import { host, port } from '../config/webServer.js';

// routes
import { v1BankAuthRouter } from '../routers/v1/bank.auth.router.js';
import { v1BankRouter } from '../routers/v1/banks.router.js';
import { v1CategoriesRouter } from '../routers/v1/categories.router.js';
import { v1CommonRouter } from '../routers/v1/common.router.js';
import { v1CustomersRouter } from '../routers/v1/customers.router.js';
import { v1EmployeesRouter } from '../routers/v1/employees.router.js';
import { v1MobileAuthRouter } from '../routers/v1/mobile.auth.router.js';
import v1MoneyReceiptRouter from '../routers/v1/mobile.mr.router.js';
import { v1MobileOrdersRouter } from '../routers/v1/mobile.orders.router.js';
import { v1ProductsRouter } from '../routers/v1/products.router.js';
import { v1MobileProductClaimRouter } from '../routers/v1/mobile.productClaim.router.js';

// express app
let httpServer;

// web server initializer
export function init() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = createServer(app);
    // Combines logging info from request and response
    app.use(morgan('combined'));

    // Parse incoming JSON requests and revive JSON.
    app.use(
      json({
        reviver: reviveJson,
      })
    );
    
    app.use(async (req, res,next) => {
        console.log(req.query);
        console.log(req.body);
        next();
    });
    
    // Mount the router at /api so all its routes start with /api
    app.use('/api', v1BankAuthRouter);
    app.use('/api', v1CategoriesRouter);
    app.use('/api', v1CommonRouter);
    app.use('/api', v1CustomersRouter);
    app.use('/api', v1EmployeesRouter);
    app.use('/api', v1MobileAuthRouter);
    app.use('/api', v1MobileOrdersRouter);
    app.use('/api', v1ProductsRouter);
    app.use('/api', v1BankRouter);
    app.use('/api', v1MoneyReceiptRouter);
    app.use('/api', v1MobileProductClaimRouter);

    // handle unwanted routes
    app.all('*', (req, res) => {
      res.status(404).send('404 Not Found');
    });

    httpServer
      .listen(port)
      .on('listening', () => {
        console.log(`Web server listening on http://${host}:${port}`);

        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// close web server
export function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

// date string checking regex for oracle db
const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviveJson(key, value) {
  // revive ISO 8601 date strings to instances of Date
  if (typeof value === 'string' && iso8601RegExp.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
}
