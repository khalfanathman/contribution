const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// const dummy = require('mongoose-dummy');

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const userSchema = new mongoose.Schema(
  {
    first_name: String,
    middle_name: String,
    last_name: String,
    phone: Number,
    welfare_ID: {
      type: mongoose.Schema.ObjectId,
      ref: 'Welfare',
    },
    //refernce
    //   isActive: Boolean,
    savings: {
      type: mongoose.Schema.ObjectId,
      ref: 'Saving',
    },
    role: {
      type: String,
      enum: [
        'super-user',
        'member',
        'admin',
        'secretary',
        'treasurer',
        'chairman',
        'viceChair',
        'orgSec',
        'execCom',
        'specialInt',
        'youthInt',
      ],
      default: 'member',
    },
    email: {
      type: String,
      required: [true, 'Please enter your EMail'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    // contrib: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Contribution',
    //   required: [true, 'Dependent must belong to a Member.'],
    // },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
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
userSchema.virtual('dependents', {
  ref: 'Dependent',
  foreignField: 'member',
  localField: '_id',
});
userSchema.virtual('beneficiaries', {
  ref: 'Beneficiaries',
  foreignField: 'member',
  localField: '_id',
});
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});
// userSchema.statics.calcAges = async function (dependentId) {
//   const age = await this.aggregate([
//     {
//       $project: {
//         date: '$dateOfBirth',
//         DependantAge: {
//           $divide: [
//             { $subtract: [new Date(), '$dateOfBirth'] },
//             365 * 24 * 60 * 60 * 1000,
//           ],
//         },
//       },
//     },
//   ]);

//   console.log(age);
// };

// userSchema.pre(/^find/, async function (next) {
//   this.depend = await this.find();
//   console.log(this.depend);
//   next();
// });
// userSchema.post(/^find/, async function (next) {
//   await this.depend.constructor.calcAges(this.depend._id);
//   next();
// });
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// USE THIS TO CALCULATE AGE USING DATE OF BIRTH AND CURRENT DATE
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Member = mongoose.model('User', userSchema);
module.exports = Member;
