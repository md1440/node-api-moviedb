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

const router = express.Router();

router.route('/top-100-alltime').get(aliasTop100, getMovies);

router.route('/top-100-yearly/:year').get(getTopMoviesByYear);

router.route('/random').get(getRandomMovies);

router.route('/stats').get(getMovieStats);

router.route('/').get(getMovies).post(createMovie);
router
  .route('/:id')
  .get(getMovieById)
  .patch(updateMovieById)
  .delete(deleteMovieById);

export default router;
