const logErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const logErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // unexpected err, bugs, package errs
    console.log('*** error', err);
    res.status(500).json({
      status: 'error',
      message: 'Oops, something went wrong...',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  //   console.log(err.stack);
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500; // default 500 internal server error

  if (process.env.NODE_ENV === 'development') {
    logErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    logErrProd();
  }
};

export default errorHandler;
