import Movie from '../models/moviesModel.js';

const aliasTop100 = (req, res, next) => {
  req.query.rating = { gte: '7.5' };
  req.query.limit = '100';
  req.query.sort = '-rating';
  req.query.fields = 'rating,title,year,genres';
  next();
};

const getMovies = async (req, res) => {
  try {
    // *** Building the Query
    // 1) Filtering & Complex Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    console.log(queryStr);
    queryStr = queryStr.replace(
      /\b(lt|gt|lte|gte|eq|in|all)\b/g,
      (match) => `$${match}`
    );
    queryStr = queryStr.replace(/\b(rating)\b/g, (match) => `imdb.${match}`);
    // queryStr = queryStr.replace(/\b(genres)\b/g, () => 'genres[0]');
    // console.log(queryStr);

    let query = Movie.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort
        .replace(/\b(rating)\b/g, (match) => `imdb.${match}`)
        .split(',')
        .join(' ');

      console.log('sortBy:', sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-year'); // default sort
    }

    // 3) Field Limiting
    if (req.query.fields) {
      let fields = req.query.fields.split(',').join(' ');
      fields = fields.replace(/\b(,rating)\b/g, (match) => `,imdb.${match}`);
      fields = fields.replace(/\b(rating,)\b/g, (match) => `imdb.${match},`);
      fields = fields.replace(/\b(rating)\b/g, (match) => `imdb.${match}`);
      console.log('fields:', fields);
      query = query.select(fields);
    } else {
      query = query.select('-num_mflix_comments');
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 50;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numMovies = await Movie.countDocuments();
      if (skip >= numMovies) throw new Error('This page does not exist');
    }

    // console.log(query);
    // *** Executing the Query
    // console.log(req.query, queryStr);
    const movies = await query;

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

export {
  aliasTop100,
  getMovies,
  getMovieById,
  createMovie,
  updateMovieById,
  deleteMovieById,
};
