class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //BUILD THE QUERRY
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limi', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    // 1) ADVANCED FILTERING
    // Change json to double quoted object inorder
    //to use replace method to change matched string
    //from this ---> {'amount_contributed' : 'easy', 'duration' : {'gte' :'5'}}
    //To this --->  {"amount_contributed" : "easy", "duration" : {"gte" : "5"}}
    // We are doin this inorder to change filter ojects like  //gte,gt,lte,lt
    // To  //$gte,$gt,$lte,$lt to be able to use them as filter strings in our api
    // this is the only way we can get result
    //gte,gt,lte,lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //FIRST WAY FOR FILTERING

    // const query = Contributions.find(queryObj);
    // we use this instead
    // let query = Contribution.find(JSON.parse(queryString));
    //SECOND METHOD FOR FILTERING
    // const query = await Contributions.find()
    //   .where('target')
    //   .equals(250000)
    //   .where('contributed_amount')
    //   .equals(570000);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //2) SORTING
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort('-start_date');
    }
    return this;
  }

  limiFields() {
    // 3) fields limiting
    if (this.queryString.fields) {
      const fields = this.queryString.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
