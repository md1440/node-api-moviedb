import ApiError from '../utils/apiError.js';

const invalidUrlsRouter = (req, res, next) => {
  next(new ApiError(`${req.originalUrl} not found on this server...`, 404));
};

// const invalidUrlsRouter = (req, res, next) => {
//   const err = new Error(`${req.originalUrl} not found on this server...`);
//   err.status = 'fail';
//   err.statusCode = 404;
//   next(err); // only err can be passed in next()
// };

// const invalidUrlsRouter = (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server...`,
//   });
// };

export default invalidUrlsRouter;
