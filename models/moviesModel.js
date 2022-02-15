/* eslint-disable no-useless-escape */
import mongoose from 'mongoose';
import slugify from 'slugify';

// *** Defining the Schema
const movieSchema = mongoose.Schema(
  {
    plot: {
      type: String,
      required: [true, 'A movie must have a plot.'],
      trim: true,
      minlength: [30, 'A plot must have more or equal then 30 characters'],
      maxlength: [400, 'A plot must have less or equal then 400 characters'],
    },
    genres: {
      type: [String],
      required: [true, 'A movie must have a genre.'],
      minlength: [10, 'A genre must have more or equal then 10 characters'],
      maxlength: [120, 'A genre must have less or equal then 120 characters'],
      trim: true,
      validate: {
        validator: function (val) {
          return val.every((item) => /^[A-Za-z\s]*$/.test(item));
        },
        message: 'A genre must only contain characters and spaces.',
      },
    },
    poster: String,
    runtime: Number,
    cast: {
      type: [String],
      required: [true, 'A movie must have a cast.'],
      minlength: [3, 'A name must have more or equal then 3 characters'],
      maxlength: [20, 'A name must have less or equal then 20 characters'],
      trim: true,
    },
    num_mflix_comments: {
      type: Number,
      select: false,
    },
    title: {
      type: String,
      required: [true, 'A movie must have a title.'],
      minlength: [3, 'A title must have more or equal then 3 characters'],
      maxlength: [40, 'A title must have less or equal then 40 characters'],
      trim: true,
      validate: {
        validator: function (val) {
          return /^[a-zA-Z\(\)\s\u00C0-\u00FF]*$/.test(val);
        },
        message: 'A title must only contain characters, spaces and numbers.',
      },
    },
    fullplot: {
      type: String,
      minlength: [
        120,
        'A fullplot must have more or equal then 120 characters ...',
      ],
      maxlength: [
        1200,
        'A fullplot must have less or equal then 1200 characters',
      ],
      trim: true,
    },
    countries: {
      type: [String],
      // required: [true, 'A movie must have a country.'],
      minlength: [3, 'A country must have more or equal then 3 characters'],
      maxlength: [15, 'A country must have less or equal then 15 characters'],
      trim: true,
      validate: {
        validator: function (val) {
          return val.every((item) => /^[A-Za-z\s]*$/.test(item));
        },
        message: 'A country must only contain characters and spaces.',
      },
    },
    released: Date,
    directors: {
      type: [String],
      required: [true, 'A movie must have a director.'],
      minlength: [3, 'A name must have more or equal then 3 characters'],
      maxlength: [20, 'A name must have less or equal then 20 characters'],
      trim: true,
    },
    rated: {
      type: String,
      // required: [true, 'A movie must have a Parental Guidelines Rating.'],
      trim: true,
    },
    awards: {
      wins: Number,
      nominations: Number,
      text: String,
    },
    lastupdated: {
      type: String,
      default: function () {
        return new Date().toISOString();
      },
      select: false,
    },
    year: {
      type: Number,
      required: [true, 'A movie must have a production year.'],
      trim: true,
      validate: {
        validator: function (val) {
          return /[0-9]{4}$/.test(val);
        },
        message: 'A country must only contain characters and spaces.',
      },
    },
    imdb: {
      rating: {
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [10, 'Rating must be below 10.0'],
        default: 1,
      },
      votes: {
        type: Number,
        default: 0,
      },
      id: {
        type: Number,
        default: 0,
        select: false,
      },
    },
    type: {
      type: String,
      trim: true,
      enum: {
        values: ['movie', 'serie'],
        message: 'The type must be either: movie, series.',
      },
    },
    tomatoes: {
      viewer: {
        rating: {
          type: Number,
          min: [1, 'Rating must be above 1.0'],
          max: [100, 'Rating must be below 100.0'],
        },
        numReviews: Number,
        meter: Number,
      },
      production: String,
      lastUpdated: Date,
    },
    slug: String,
    __v: {
      type: Number,
      select: false,
    },
    id: {
      type: String,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// *** Create Index to make string searchable for title and plot
movieSchema.index(
  {
    title: 'text',
    plot: 'text',
  },
  {
    weights: {
      title: 1,
      plot: 1,
    },
  }
);

// *** Create Virtual Field
movieSchema.virtual('yearsSinceRelease').get(function () {
  const currentDate = new Date();
  return currentDate.getFullYear() - this.year * 1;
});

// *** Create Document Middleware

// 1) Use slugify to create a slug(string) for urls (runs only on save()/create())
movieSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// *** Create Query Middleware/Hooks

// 1) Log query time pre/post find(), findById()
// movieSchema.pre(/^find/, function (next) {
//   this.start = Date.now();
//   next();
// });

// movieSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   next();
// });

// *** Create Aggregation Middleware

// 1) Add match-condition of 30min minimum runtime to any pipeline array pre-execution
movieSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { runtime: { $gte: 30 } } });
  next();
});

// *** Wrapping the Schema in a Model
const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
