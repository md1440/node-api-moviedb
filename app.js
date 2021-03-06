import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import invalidUrlsRouter from './routers/invalidUrlsRouter.js';
import moviesRouter from './routers/moviesRouter.js';
import errorHandler from './utils/errorHandler.js';

// *** Creating the EXPRESS App
const app = express();

//*** Middleware Stack

//*** Implement Cors on all Routes -> Access-Control-Allow-Origin *
app.use(cors());

// *** Enabling pre-flight - Responding to options requests on delete, patch, put
app.options('*', cors());

//*** Helmet for setting various HTTP headers for security
app.use(helmet());

// *** Compression to compress response bodies for all requests coming through
app.use(compression());

// *** Morgan Http Logger for Dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// *** Json middleware to parse incoming requests with JSON payloads
app.use(express.json()); // access to req.body

// *** Mounting the Router for /movies endpoint
app.use('/api/v1/movies', moviesRouter);

// *** Routing invalid Urls
app.all('*', invalidUrlsRouter);

// *** Err Handler middleware -> only called by express if err
app.use(errorHandler);

export default app;
