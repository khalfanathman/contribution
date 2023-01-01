const mongoose = require('mongoose');
const slugify = require('slugify');
const Member = require('./usermodel');
// const validator = require('validator');
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
    avrgContrib: {
      type: Number,
      default: 40,
      set: (val) => Math.round(val * 10) / 10,
    },
    numberOfContrib: {
      type: Number,
      default: 0,
    },
    amount_contributed: {
      type: Number,
      default: 250000,
      min: [90000, 'Must be above 50000'],
    },
    target: {
      type: Number,
      default: 250000,
      min: [50000, 'Must be above 50000'],
    },
    // avragTarget: {
    //   tyepe: Number,
    //   default: 40,
    // },

    //create birth date for calculating age
    benficiary: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Dependaet',
      },
    ],
    gender: {
      type: String,
      enum: genderValues,
    },
    // beneficiary: {
    //   type: Object,
    //   default: null,
    // },
    place_for_burial: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    Welfare: {
      type: mongoose.Schema.ObjectId,
      ref: 'Welfare',
    },
    // location: [
    //   {
    //     type: string,
    //     default: 'Point',
    //     enum: ['Point'],
    //   },
    //   {
    //     GeolocationCoordinates: [Number],
    //     address: String,
    //     description: String,
    //     burial_day: Number,
    //   },
    // ],
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
contributionSchema.methods.calcAge = function () {
  // console.log(Date.now());
  // this points to the current query
  // this.populate({ path: 'member' });
  next();
};
contributionSchema.index({ place_for_burial: '2dsphere' });
// DOCUMENT MIDDLEWAR : RUNS B4 .SAVE() AND .CREATE()
contributionSchema.pre('save', function (next) {
  this.slug = slugify(this.tittle, { lower: true });
  next();
});
contributionSchema.pre('save', async function (next) {
  const memberPromise = this.members.map(
    async (id) => await Member.findById(id)
  );
  this.members = await Promise.all(memberPromise);
  next();
});

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

contributionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'members',
  });

  next();
});
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
  // console.log(this.pipeline());
  next();
});
const Contribution = mongoose.model('Contribution', contributionSchema);

module.exports = Contribution;
