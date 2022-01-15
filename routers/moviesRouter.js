import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
} from '../controllers/moviesController.js';

const router = express.Router();

router.route('/').get(getAllMovies).post(createMovie);
router
  .route('/:id')
  .get(getMovieById)
  .patch(updateMovieById)
  .delete(deleteMovieById);
// router.route('/year=:year').get(getMovieByYear);

export default router;
