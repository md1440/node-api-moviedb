import Movie from '../models/moviesModel.js';
import APIFeatures from '../utils/apiFeatures.js';

const aliasTop100 = (req, res, next) => {
  req.query.rating = { gte: '7.5' };
  req.query.limit = '100';
  req.query.sort = '-rating';
  req.query.fields = 'rating,title,year,genres';
  next();
};

const getMovies = async (req, res) => {
  try {
    console.log(req.query);
    // *** Executing the Query
    const api = new APIFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .search()
      .searchAll();
    const movies = await api.query;

    res.status(200).json({
      status: 'success',
      results: movies.length,
      data: {
        movies,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie === null) {
      // id not found returns null
      res.status(200).json({
        status: 'success',
        message: 'Id not found in the database.',
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          movie,
        },
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        movie: newMovie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
      casterror: err.name,
      info: err,
    });
  }
};

const updateMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // returns updated document
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const deleteMovieById = async (req, res) => {
  try {
    await Movie.findByIdAndRemove(req.params.id);
    res.status(204).json({
      // 204 = no content
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getMovieStats = async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      {
        $match: { 'imdb.rating': { $gte: 5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$type' },
          count: { $sum: 1 },
          avgRating: { $avg: '$imdb.rating' },
          avgRunTime: { $avg: '$runtime' },
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getTopMoviesByYear = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const list = await Movie.aggregate([
      {
        // $match: { year: { $eq: year } },
        $match: {
          $and: [
            { year: { $eq: year } },
            { 'imdb.rating': { $gte: 5 } },
            { 'imdb.votes': { $gte: 500 } },
            { type: { $eq: 'movie' } },
          ],
        },
      },
      {
        $project: {
          title: 1,
          cast: 1,
          directors: 1,
          plot: 1,
          'imdb.rating': 1,
        },
      },
      {
        $sort: { 'imdb.rating': -1 },
      },
      {
        $limit: 100,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        list,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getRandomMovies = async (req, res) => {
  try {
    const random = await Movie.aggregate([
      {
        $match: { 'imdb.rating': { $gte: 5 } },
      },
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          title: 1,
          cast: 1,
          directors: 1,
          plot: 1,
          'imdb.rating': 1,
          year: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: random.length,
      data: {
        random,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export {
  aliasTop100,
  getMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
  getMovieStats,
  getTopMoviesByYear,
  getRandomMovies,
};
