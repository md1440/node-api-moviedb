import express from 'express';
import morgan from 'morgan';

const app = express();

// *** Middleware Stack
if (process.env.NODE_DEV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());


// *** Routing
// app.use('/api/v1/movies', moviesRouter);

export default app;
