class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Movie.find()
    this.queryString = queryString; // req.query
  }

  // *** Building the Query

  // *** 1) Building the filter for conditions -> find()
  filter() {
    const queryObj = { ...this.queryString }; // hardcopy of req.query
    // 1) delete fields for sort, page, limit and fields from queryObj
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Modify the query to match with Mongoose/MongoDB Operator Syntax
    let queryStr = JSON.stringify(queryObj); // obj to str
    // 2.1 Add the $ to the query
    queryStr = queryStr.replace(
      /\b(lt|gt|lte|gte|eq|in|all)\b/g,
      (match) => `$${match}`
    );
    // 2.2 Modify the genre query
    queryStr = queryStr.replace(/\b(action)\b/g, 'Action');
    queryStr = queryStr.replace(/\b(animation)\b/g, 'Animation');
    queryStr = queryStr.replace(/\b(adventure)\b/g, 'Adventure');
    queryStr = queryStr.replace(/\b(biography)\b/g, 'Biography');
    queryStr = queryStr.replace(/\b(comedy)\b/g, 'Comedy');
    queryStr = queryStr.replace(/\b(crime)\b/g, 'Crime');
    queryStr = queryStr.replace(/\b(drama)\b/g, 'Drama');
    queryStr = queryStr.replace(/\b(documentary)\b/g, 'Documentary');
    queryStr = queryStr.replace(/\b(fantasy)\b/g, 'Fantasy');
    queryStr = queryStr.replace(/\b(history)\b/g, 'History');
    queryStr = queryStr.replace(/\b(horror)\b/g, 'Horror');
    queryStr = queryStr.replace(/\b(thriller)\b/g, 'Thriller');
    queryStr = queryStr.replace(/\b(mystery)\b/g, 'Mystery');
    queryStr = queryStr.replace(/\b(sci-Fi)\b/g, 'Sci-Fi');
    queryStr = queryStr.replace(/\b(war)\b/g, 'War');

    // 2.3 Provide correct property access for imdb.rating
    queryStr = queryStr.replace(/\b(rating)\b/g, (match) => `imdb.${match}`);

    // 2.4 Store the Query Object .find()
    this.query = this.query.find(JSON.parse(queryStr));
    return this; // returns the entire object
  }

  // *** Building the sort -> sort()
  sort() {
    // 1) check for sort on req.query
    if (this.queryString.sort) {
      // 2.1) Modfiy the req.query and store in sortBy
      // 2.2) Handle Rating, Remove ',' in case of multiple sort options
      const sortBy = this.queryString.sort
        .replace(/\b(rating)\b/g, (match) => `imdb.${match}`)
        .split(',')
        .join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-released'); // default sort
    }
    return this; // returns the entire object
  }

  // *** Building the select for fields -> select()
  limitFields() {
    // 1) check for fields on req.query
    if (this.queryString.fields) {
      // 2.1) Modfiy the req.query and store in fields
      // 2.2) Handle Rating, Remove ',' in case of multiple sort options
      let fields = this.queryString.fields.split(',').join(' ');
      fields = fields.replace(/\b(,rating)\b/g, (match) => `,imdb.${match}`);
      fields = fields.replace(/\b(rating,)\b/g, (match) => `imdb.${match},`);
      fields = fields.replace(/\b(rating)\b/g, (match) => `imdb.${match}`);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // *** Building pagination with skip() & limit()
  paginate() {
    const page = this.queryString.page * 1 || 1; // convert to num, default 1
    const limit = this.queryString.limit * 1 || 100; // convert to num, default 100
    // Skip -> e.g. page=3&limit=10, 1-10 p1. 11-20 p2, 21-30 p3
    // e.g. query.skip(20).limit(10)
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  // *** Building the String Search -> find()
  // 1) Search with OR operator
  search() {
    if (this.queryString.search) {
      const searchObj = { $text: { $search: this.queryString.search } }; //mongodb syntax
      this.query = this.query.find(searchObj);
    }
    return this;
  }

  // 2) Search with AND operator
  searchAll() {
    if (this.queryString.searchall) {
      // Add "" to syntax for AND search
      const keywords = this.queryString.searchall
        .split(' ')
        .map((el) => `"${el}"`)
        .join('');
      const searchObj = { $text: { $search: keywords } };
      this.query = this.query.find(searchObj);
    }
    return this;
  }
}

export default APIFeatures;
