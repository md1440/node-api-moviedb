import express from 'express';
import morgan from 'morgan';
import moviesRouter from './routers/moviesRouter.js';
import unhandledUrlsRouter from './routers/unhandledRouter.js';

// *** Creating the EXPRESS App
const app = express();

// *** Middleware Stack
// 1) Loading Morgan Http Logger for Dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // http logger
}

// 2) Loading Json middleware to parse incoming requests with JSON payloads
app.use(express.json()); // access to req.body

// *** Mounting the Router for /movies endpoint
app.use('/api/v1/movies', moviesRouter);

// *** Routing unhandled Urls
app.all('*', unhandledUrlsRouter);

export default app;
