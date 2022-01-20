// *** Query Modifiers fot APIFeatures

// *** Modifying find()
// 2.1 Add the $ to the query
const modifyQueryConditions = (queryStr) => {
  queryStr = queryStr.replace(
    /\b(lt|gt|lte|gte|eq|in|all)\b/g,
    (match) => `$${match}`
  );
  return queryStr;
};

// 2.2 Modify the genre query
const modifyQueryGenre = (queryStr) => {
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
  return queryStr;
};

// 2.3 Provide correct property access for imdb.rating
const modifyQueryRating = (queryStr) => {
  queryStr = queryStr.replace(/\b(rating)\b/g, (match) => `imdb.${match}`);
  return queryStr;
};

// *** Modifying sort()
// 2.1) Modfiy the req.query and store in sortBy
// 2.2) Handle Rating, Remove ',' in case of multiple sort options
const modifyQuerySort = (queryStrSort) => {
  queryStrSort = queryStrSort
    .replace(/\b(rating)\b/g, (match) => `imdb.${match}`)
    .split(',')
    .join(' ');
  return queryStrSort;
};

// *** Modify Fields

const modifyQueryFields = (fields) => {
  fields = fields.replace(/\b(,rating)\b/g, (match) => `,imdb.${match}`);
  fields = fields.replace(/\b(rating,)\b/g, (match) => `imdb.${match},`);
  fields = fields.replace(/\b(rating)\b/g, (match) => `imdb.${match}`);
  return fields;
};

const modifyQueryKeywords = (keywords) => {
  keywords = keywords
    .split(' ')
    .map((el) => `"${el}"`)
    .join('');
  return keywords;
};

export {
  modifyQueryConditions,
  modifyQueryGenre,
  modifyQueryRating,
  modifyQuerySort,
  modifyQueryFields,
  modifyQueryKeywords,
};
