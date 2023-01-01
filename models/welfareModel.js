const mongoose = require('mongoose');
const validator = require('validator');

// const dummy = require('mongoose-dummy');

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const welfareSchema = new mongoose.Schema(
  {
    Welfarename: String,
    email: {
      type: String,
      required: [true, 'Please enter your EMail'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    contactnumber: Number,
    chairName: {
      type: String,
      required: [true, 'Please enter Orgainazation Chair Name'],
    },
    contribution: {
      type: mongoose.Schema.ObjectId,
      ref: 'Contribution',
    },
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

welfareSchema.pre('save', async function (next) {
  // Only run this function if isActive was actually modified
  if (!this.isModified('isActive')) return next();

  //  CHANE THE isActive status to false to make the dependant a beneficiary
  // do something
  next();
});

welfareSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

welfareSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

// USE THIS TO CALCULATE AGE USING DATE OF BIRTH AND CURRENT DATE

const Welfare = mongoose.model('Welfare', welfareSchema);
module.exports = Welfare;
