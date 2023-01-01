const mongoose = require('mongoose');
const validator = require('validator');
const Contribution = require('./contributionsModel');
// const dummy = require('mongoose-dummy');

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const transactSchema = new mongoose.Schema(
  {
    Welfarename: String,
    email: {
      type: String,
      required: [true, 'Please enter your EMail'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    contactnumber: {
      type: Number,
      required: [true, 'please enter number'],
      min: [10, 'Please enter more than ten charcters'],
    },
    // chairName: {
    //   type: String,
    //   required: [true, 'Please enter Orgainazation Chair Name'],
    // },
    donation: {
      type: Number,
      min: 1000,
      required: true,
    },
    condolenceSMS: String,
    // numberOfContrib: {
    //   type: Number,
    //   default: 0,
    // },
    // amount_contributed: {
    //   type: Number,
    //   default: 250000,
    //   min: [1000, 'Must be above 50000'],
    // },
    // target: {
    //   type: Number,
    //   default: 250000,
    //   min: [50000, 'Must be above 50000'],
    // },
    // avragTgt: {
    //   type: Number,
    //   default: 125000,
    // },
    contribution: {
      type: mongoose.Schema.ObjectId,
      ref: 'Contribution',
    },
    member: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      strictPopulate: false,
    },
    savings: {
      type: mongoose.Schema.ObjectId,
      ref: 'Savings',
    },
    // transactionType: [
    //   {
    //     type: String,
    //     default: 'Mpesa',
    //     enum: ['MPesa', 'Cash', 'Account_Deduction'],
    //   },
    //   {
    //     trasactDate: Date,
    //     address: String,
    //     description: String,
    //   },
    // ],
    amountTransacted: Number,
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

transactSchema.pre('save', async function (next) {
  // Only run this function if isActive was actually modified
  if (!this.isModified('isActive')) return next();

  //  CHANE THE isActive status to false to make the dependant a beneficiary
  // do something
  next();
});
transactSchema.statics.calcAverageRatings = async function (contribId) {
  const stats = await this.aggregate([
    {
      $match: { contribution: contribId },
    },
    {
      $group: {
        _id: '$contribution',
        totalContrib: { $sum: '$donation' },
        numberOfContrib: { $sum: 1 },
        avrgContrib: { $avg: '$donation' },
      },
    },
  ]);
  console.log(stats);
  // console.log(this.member);
  // console.log(this.condolenceSMS);
  if (stats.length > 0) {
    await Contribution.findByIdAndUpdate(contribId, {
      amount_contributed: stats[0].totalContrib,
      numberOfContrib: stats[0].numberOfContrib,
      avrgContrib: stats[0].avrgContrib,
      condolence_ms: this.condolenceSMS,
      // members: this.unshif(),
    });
  } else {
    await Contribution.findByIdAndUpdate(contribId, {
      amount_contributed: 0,
      numberOfContrib: 0,
      // members: this.unshif(),
    });
  }
};

transactSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.contribution);
  // console.log(this.condolenceSMS);
  // console.log(this.member);
});

// findByIdAndUpdate
// findByIdAndDelete
transactSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});

transactSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

transactSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

transactSchema.pre(/^fi nd/, function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

// USE THIS TO CALCULATE AGE USING DATE OF BIRTH AND CURRENT DATE

const Transaction = mongoose.model('Transaction', transactSchema);
module.exports = Transaction;
