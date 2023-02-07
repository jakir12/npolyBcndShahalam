import multer from 'multer';
import {
  del,
  get,
  getDSM,
  getSR,
  getZM,
  update,
} from '../db_apis/employees.js';
import { NOT_FOUND } from '../utils/status.js';

export async function getEmployees(req, res, next) {
  try {
    const context = {};
    const result = await get(context);
    return result
      ? res.status(200).json({ len: result.length, data: result })
      : res.status(404).json({ len: 0, data: [] });
  } catch (err) {
    return next(err);
  }
}

export async function getEmployee(req, res, next) {
  try {
    const context = {};

    if (req.body.employee_number) {
      context.employee_number = req.body.employee_number;
    } else if (req.params.employee_number) {
      context.employee_number = req.params.employee_number;
    } else if (req.query.employee_number) {
      context.employee_number = req.query.employee_number;
    } else if (req.params.phone) {
      context.phone = req.params.phone;
    }

    const result = await get(context);
    return result !== null
      ? res.status(200).json(result)
      : res
          .status(404)
          .json({ message: 'Employee Not Found', status: NOT_FOUND });
  } catch (err) {
    return next(err);
  }
}

const getEmployeeFromRec = (req) => {
  const employee = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    hire_date: req.body.hire_date,
    job_id: req.body.job_id,
    salary: req.body.salary,
    commission_pct: req.body.commission_pct,
    manager_id: req.body.manager_id,
    department_id: req.body.department_id,
  };

  return employee;
};

export async function updateEmployee(req, res, next) {
  try {
    let employee = getEmployeeFromRec(req);
    employee.employee_id = parseInt(req.params.id, 10);

    employee = await update(employee);

    return employee !== null ? res.status(200).json(employee) : res.end();
  } catch (err) {
    return next(err);
  }
}

export async function deleteEmployee(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    const success = await del(id);

    return success ? res.status(200).end() : res.end();
  } catch (err) {
    return next(err);
  }
}

export async function getAllSR(req, res, next) {
  try {
    const context = {};
    const result = await getSR(context);
    return result
      ? res.status(200).json({ len: result.length, data: result })
      : res.status(404).json({ len: 0, data: [] });
  } catch (err) {
    return next(err);
  }
}
export async function getOneSR(req, res, next) {
  try {
    const context = {};
    context.employee_number = req.params.employee_number;

    const result = await getSR(context);
    return result !== null
      ? res.status(200).json(result)
      : res
          .status(404)
          .json({ message: 'Employee Not Found', status: NOT_FOUND });
  } catch (err) {
    return next(err);
  }
}

export async function getAllZM(req, res, next) {
  try {
    const context = {};
    const result = await getZM(context);
    return result
      ? res.status(200).json({ len: result.length, data: result })
      : res.status(404).json({ len: 0, data: [] });
  } catch (err) {
    return next(err);
  }
}
export async function getOneZM(req, res, next) {
  try {
    const context = {};
    context.employee_number = req.params.employee_number;

    const result = await getZM(context);
    return result !== null
      ? res.status(200).json(result)
      : res
          .status(404)
          .json({ message: 'Employee Not Found', status: NOT_FOUND });
  } catch (err) {
    return next(err);
  }
}

export async function getAllDSM(req, res, next) {
  try {
    const context = {};
    const result = await getDSM(context);
    return result
      ? res.status(200).json({ len: result.length, data: result })
      : res.status(404).json({ len: 0, data: [] });
  } catch (err) {
    return next(err);
  }
}
export async function getOneDSM(req, res, next) {
  try {
    const context = {};
    context.employee_number = req.params.employee_number;

    const result = await getDSM(context);
    return result !== null
      ? res.status(200).json(result)
      : res
          .status(404)
          .json({ message: 'Employee Not Found', status: NOT_FOUND });
  } catch (err) {
    return next(err);
  }
}

export const upload = multer({
  dest: 'public/uploads/avatars',
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error(
          'Please upload an image and that must be less than or equal to 2MB'
        )
      );
    }
    cb(null, true);
  },
});

export const uploadErrorHandler = (err, req, res, next) => {
  res.status(400).json({ message: err.message });
};

export async function addAvatar(req, res, next) {
  try {
    const context = {};
    context.employee_number = req.params.employee_number;
    context.avatar = req.file;

    // const result = await updateMobileUser(context);

    return res.json({ context, message: 'Avatar Uploaded' });
  } catch (err) {
    return next(err);
  }
}
