import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import moviesRouter from './routers/moviesRouter.js';
import invalidUrlsRouter from './routers/invalidUrlsRouter.js';

// *** Creating the EXPRESS App
const app = express();

// *** Middleware Stack

// 1) Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());

// 2) Loading Morgan Http Logger for Dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) Loading Json middleware to parse incoming requests with JSON payloads
app.use(express.json()); // access to req.body

// *** Mounting the Router for /movies endpoint
app.use('/api/v1/movies', moviesRouter);

// *** Routing invalid Urls
app.all('*', invalidUrlsRouter);

export default app;
