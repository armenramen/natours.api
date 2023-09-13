class ApiFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const queryObj = { ...this.queryObj };
    const excludeFromFilter = ['page', 'sort', 'limit', 'fields'];
    excludeFromFilter.forEach((el) => delete queryObj[el]);
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(lt|lte|gt|gte)\b/g,
      (matched) => `$${matched}`,
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort(defaultSort = '-createdAt') {
    if (this.queryObj.sort) {
      const sortBy = this.queryObj.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(defaultSort);
    }

    return this;
  }

  limitFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryObj.page * 1 || 1;
    const pageSize = this.queryObj.limit * 1 || 100;
    const skip = (page - 1) * pageSize;

    this.query = this.query.skip(skip).limit(pageSize);
    return this;

    // if (this.queryObj.page) {
    //   const numTours = await this.query.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error('Page does not exist');
    //   }
    // }
  }
}

module.exports = ApiFeatures;
