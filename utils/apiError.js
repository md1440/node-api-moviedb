class ApiError extends Error {
  constructor(message, statusCode) {
    // 1) call Error (parent) constructor
    // 2) pass msg property
    super(message);

    this.statusCode = statusCode;
    // fail for 400s, error for 500s
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Error.captureStackTrace(this)0; // err shows up in err.stack
    Error.captureStackTrace(this, this.constructor); // current obj, AppError class
    // when new obj is created and the constructor funct is called
    // call will not appear in the stacktrace ...
  }
}

export default ApiError;
