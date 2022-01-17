import express from 'express';
import {
  aliasTop100,
  getMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
} from '../controllers/moviesController.js';

const router = express.Router();

router.route('/top-100-alltime').get(aliasTop100, getMovies);
router.route('/').get(getMovies).post(createMovie);
router
  .route('/:id')
  .get(getMovieById)
  .patch(updateMovieById)
  .delete(deleteMovieById);
// router.route('/year=:year').get(getMovieByYear);

export default router;
