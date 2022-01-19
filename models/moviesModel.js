import mongoose from 'mongoose';
import slugify from 'slugify';

// *** Defining the Schema
const movieSchema = mongoose.Schema(
  {
    plot: {
      type: String,
      required: [true, 'A movie must have a name.'],
      trim: true,
      minlength: [15, 'A tour name must have more or equal then 10 characters'],
      maxlength: [
        144,
        'A tour name must have less or equal then 40 characters',
      ],
    },
    genres: {
      type: [String],
      required: [true, 'A movie must have a genre.'],
      trim: true,
    },
    poster: String,
    runtime: Number,
    cast: {
      type: [String],
      required: [true, 'A movie must have a cast.'],
      trim: true,
    },
    num_mflix_comments: {
      type: Number,
      select: false,
    },
    title: {
      type: String,
      required: [true, 'A movie must have a title.'],
      trim: true,
    },
    fullplot: {
      type: String,
      required: [true, 'A movie must have a plot.'],
      trim: true,
    },
    countries: {
      type: [String],
      required: [true, 'A movie must have a country.'],
      trim: true,
    },
    released: Date,
    directors: {
      type: [String],
      required: [true, 'A movie must have a director.'],
      trim: true,
    },
    rated: {
      type: String,
      required: [true, 'A movie must have a Parental Guidelines Rating.'],
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

// *** Create Index to make string searchable
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
// 1) Use slugify to create a slug(string) for urls
movieSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// *** Create Query Middleware/Hooks
// 1) Log query time pre/post
movieSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

movieSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// *** Create Aggregation Middleware
// 1) Add match-condition of 30min minimum runtime to any pipeline array pre-execution
movieSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { runtime: { $gte: 30 } } });
  // console.log(this.pipeline());
  next();
});

// *** Wrapping the Schema in a Model
const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
