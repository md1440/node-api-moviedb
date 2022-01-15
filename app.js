import express from 'express';
import morgan from 'morgan';
import moviesRouter from './routers/moviesRouter.js';

const app = express();

// *** Middleware Stack
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // http logger
}

app.use(express.json()); // access to req.body

// *** Mounting the Router
app.use('/api/v1/movies', moviesRouter);

export default app;
