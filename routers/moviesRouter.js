import express from 'express';
import {
  aliasTop100,
  getMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
  getMovieStats,
  getTopMoviesByYear,
  getRandomMovies,
} from '../controllers/moviesController.js';

// *** Creating the Router
const router = express.Router();

// *** Routing for Alias
router.route('/top-100-alltime').get(aliasTop100, getMovies);

// *** Routing for Aggregation Pilelines
router.route('/top-100-yearly/:year').get(getTopMoviesByYear);
router.route('/random').get(getRandomMovies);
router.route('/stats').get(getMovieStats);

// *** Routing Base
router.route('/').get(getMovies).post(createMovie);
router
  .route('/:id')
  .get(getMovieById)
  .patch(updateMovieById)
  .delete(deleteMovieById);

export default router;
