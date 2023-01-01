const mongoose = require('mongoose');
const validator = require('validator');
const Beneficiary = require('./beneficiaryModel');

// const dummy = require('mongoose-dummy');

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const dependSchema = new mongoose.Schema(
  {
    first_name: String,
    middle_name: String,
    last_name: String,
    relation: String,
    status: {
      type: String,
      enum: ['Approved', 'Declined'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your EMail'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone_number: Number,
    photo: String,
    ID_n: {
      type: Number,
      required: [true, 'Enter ID number'],
    },
    birthCertNo: {
      type: Number,
      required: [true, 'Enter certificate number'],
    },
    attachbirthCert: String,
    attachId_no: String,
    dateOfBirth: Date,
    member: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Dependent must belong to a Member.'],
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
dependSchema.virtual('age').get(function () {
  const birthdate = this.dateOfBirth;
  console.log(birthdate);
  const cur = new Date();
  const diff = cur - birthdate; // This is the difference in milliseconds
  const age = Math.floor(diff / 31557600000);

  return age;
});
dependSchema.static('updateBeneficiary', async function (depend, id) {
  mongoose.model('Dependent').findOne({ _id: id }, function (err, result) {
    let swap = new (mongoose.model('Beneficiaries'))(result.toJSON()); //or result.toObject
    /* you could set a new id
    swap._id = mongoose.Types.ObjectId()
    swap.isNew = true
    */

    result.remove();
    swap.save();

    // swap is now in a better place
  });
  // console.log(depend);
  // console.log(id);
  // const Benef = new Beneficiary(depend);
  // Benef.save();
  // return Benef;
});

dependSchema.pre('save', async function (next) {
  // Only run this function if isActive was actually modified

  if (this.isActive == false) {
    console.log(this.isActive);
    await Beneficiary.save(this.find({ isActive: false }));
  }
  return next();
});
// dependSchema.pre('save', async function (next) {
//   // Only run this function if isActive was actually modified
//   const membersPromise = async id=>  await find
//   next();
// });
dependSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

dependSchema.methods.updateBeneficiary = async function () {
  console.log('depend static method');
  this.isActive = false;
  if (this.isActive == false) {
  }
};

// USE THIS TO CALCULATE AGE USING DATE OF BIRTH AND CURRENT DATE
const Dependent = mongoose.model('Dependent', dependSchema);

module.exports = Dependent;
