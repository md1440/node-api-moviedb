import mongoose from 'mongoose';

const movieSchema = mongoose.Schema({
  plot: {
    type: String,
    required: [true, 'A movie must have a name'],
    trim: true,
  },
  genres: {
    type: [String],
    required: [true, 'A movie must have a genre'],
  },
  runtime: Number,
  cast: {
    type: [String],
    required: [true, 'A movie must have a cast'],
  },
});
