const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const { string } = require('prop-types');
// const dummy = require('mongoose-dummy');

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const genderValues = ['Male', 'Female'];
const contributionSchema = new mongoose.Schema(
  {
    tittle: {
      type: String,
      required: [true, 'Contribution must have a Title'],
      unique: true,
      trim: true,
      maxlength: [40, 'tilt must have less than 40 characters'],
      minlength: [10, 'tilt must have more than 10 characters'],
      // validate: validator.isAlpha,
    },
    slug: String,
    email: {
      type: String,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Please input summary'],
    },
    amount_contributed: {
      type: Number,
      default: 250000,
      min: [90000, 'Must be above 50000'],
    },

    //create birth date for calculating age
    benfDOB: {
      type: Date,
      max: ['1988-05-02', 'enter valid date'],
      // default: '1988-05-02',
    },
    gender: {
      type: String,
      enum: genderValues,
    },
    // beneficiary: {
    //   type: Object,
    //   default: null,
    // },
    place_for_burial: String,
    condolence_ms: [String],
    image: [String],
    imageCover: {
      type: String,
      required: [true, 'insert a cover image'],
    },
    description: {
      type: String,
      trim: true,
    },
    target: {
      type: Number,
      default: 250000,
      min: [50000, 'Must be above 50000'],
    },
    start_date: {
      type: Date,
      default: Date.now(),
    },
    end_date: [Date],
    member_status: {
      type: Boolean,
      default: true,
    },
    secretContrib: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// DOCUMENT MIDDLEWAR : RUNS B4 .SAVE() AND .CREATE()
contributionSchema.pre('save', function (next) {
  this.slug = slugify(this.tittle, { lower: true });
  next();
});
// contributionSchema.pre('save', function (next) {
//   console.log('second doc middlware');
//   next();
// });
// contributionSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });
//TODO
//1) CALCULATE AGE
contributionSchema.virtual('Age').get(function () {
  return Date.now() - this.Date;
});
//QUERY MIDDLEWARE
// contributionSchema.pre('find', function (next) {
contributionSchema.pre('/^find/', function (next) {
  this.find({ secretContrib: { $ne: true } });
  // this.dob = DateFromTime()
  next();
});
contributionSchema.post('/^find/', function (doc, next) {
  this.find({ secretContrib: { $ne: true } });
  next();
});

// AGGREGATION MIDDELWARE

contributionSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretContrib: { $ne: true } } });
  console.log(this.pipeline());
  next();
});
const Contribution = mongoose.model('Contribution', contributionSchema);
// console.log('DURING CONNECTION');
// // // let model = mongoose.model('Student', schemaDefinition);
// const drand = [];
// for (let i = 0; i < 10; i++) {
//   let randomObject = dummy(Contribution, {
//     ignore: ignoredFields,
//     returnDate: true,
//   });
//   drand[i] = randomObject;
//   // const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
//   // console.log(`File written! : ${i} times`);
//   let contribution = drand[i];
//   Contribution.create(contribution);
//   // await User.create(users, { validateBeforeSave: false });
//   // await Review.create(reviews);
// }
// console.log('Data successfully loaded!');
// JSON.parse(fs.writeFileSync(`${__dirname}/txt/output.json`, newObj));
// console.log(drand[i]);
// console.log(this.drand);
// const newObj = JSON.stringify(drand[i]);
// JSON.parse(fs.writeFileSync(`${__dirname}/txt/output.json`, newObj));
module.exports = Contribution;
