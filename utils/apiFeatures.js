class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // *** Building the Query

  filter() {
    const queryObj = { ...this.queryString }; // req.query
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    // console.log(queryStr);
    queryStr = queryStr.replace(
      /\b(lt|gt|lte|gte|eq|in|all)\b/g,
      (match) => `$${match}`
    );
    queryStr = queryStr.replace(/\b(rating)\b/g, (match) => `imdb.${match}`);
    // queryStr = queryStr.replace(/\b(genres)\b/g, () => 'genres[0]');
    console.log(queryStr);

    this.query = this.query.find(JSON.parse(queryStr));
    return this; // returns the entire object
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort
        .replace(/\b(rating)\b/g, (match) => `imdb.${match}`)
        .split(',')
        .join(' ');

      console.log('sortBy:', sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-year'); // default sort
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(',').join(' ');
      fields = fields.replace(/\b(,rating)\b/g, (match) => `,imdb.${match}`);
      fields = fields.replace(/\b(rating,)\b/g, (match) => `imdb.${match},`);
      fields = fields.replace(/\b(rating)\b/g, (match) => `imdb.${match}`);
      console.log('fields:', fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-num_mflix_comments');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchObj = { $text: { $search: this.queryString.search } };

      // console.log('Textsearch:', searchStr);
      this.query = this.query.find(searchObj);
    }
    return this;
  }

  searchAll() {
    if (this.queryString.searchall) {
      const keywords = this.queryString.searchall
        .split(' ')
        .map((el) => `"${el}"`)
        .join('');
      const searchObj = { $text: { $search: keywords } };

      // console.log('Textsearch:', searchStr);
      this.query = this.query.find(searchObj);
    }
    return this;
  }
}
export default APIFeatures;
