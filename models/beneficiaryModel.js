/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-const */
const mongoose = require('mongoose');
const validator = require('validator');
const Dependent = require('./dependantModel');

// const dummy = require('mongoose-dummy');

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const benfSchema = new mongoose.Schema(
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
// new mongoose.Schema(
//   {
//     email: {
//       type: 'string',
//     },
//     roles: {
//       type: 'array',
//       items: {
//         type: 'string',
//       },
//     },
//     apiKey: {
//       type: 'string',
//     },
//     profile: {
//       type: 'object',
//       required: [],
//       properties: {
//         dob: {
//           type: 'string',
//         },
//         name: {
//           type: 'string',
//         },
//         about: {
//           type: 'string',
//         },
//         address: {
//           type: 'string',
//         },
//         company: {
//           type: 'string',
//         },
//         location: {
//           type: 'object',
//           required: [],
//           properties: {
//             lat: {
//               type: 'number',
//             },
//             long: {
//               type: 'number',
//             },
//           },
//         },
//       },

//       username: {
//         type: 'string',
//       },
//       createdAt: {
//         type: 'string',
//       },
//       updatedAt: {
//         type: 'string',
//       },
//     },
//     //   {
//     //     first_name: String,
//     //     middle_name: String,
//     //     last_name: String,
//     //     email: {
//     //       type: String,
//     //       required: [true, 'Please enter your EMail'],
//     //       unique: true,
//     //       lowercase: true,
//     //       validate: [validator.isEmail, 'Please provide a valid email'],
//     //     },
//     //     phone_number: Number,
//     //     photo: String,
//     //     ID_n: {
//     //       type: Number,
//     //       required: [true, 'Enter ID number'],
//     //     },
//     //     birthCertNo: {
//     //       type: Number,
//     //       required: [true, 'Enter certificate number'],
//     //     },
//     //     attachbirthCert: Number,
//     //     attachId_no: Number,
//     //     dateOfBirth: Date,
//     //     member: {
//     //       type: mongoose.Schema.ObjectId,
//     //       ref: 'User',
//     //       required: [true, 'Dependent must belong to a Member.'],
//     //     },
//     //     contributionEvent: {
//     //       type: mongoose.Schema.ObjectId,
//     //       ref: 'Contribution',
//     //       required: [true, 'Please enter Contribution Event'],
//     //     },
//     //     dateOfBirth: {
//     //       type: Date,
//     //       required: true,
//     //     },
//     //     dateOfDeath: {
//     //       type: Date,
//     //     },
//     //     isActive: {
//     //       type: Boolean,
//     //       default: true,
//     //       select: false,
//     //     },
//     //   },
//     member: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//     },
//     contributionEvent: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'Contribution',
//       required: [true, 'Please enter Contribution Event'],
//     },
//     isActive: {
//       type: Boolean,
//       default: false,
//       select: false,
//     },
//   },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

benfSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// benfSchema.pre(/^find/, function (next) {
//   // this points to the current query
//   // this.populate({ path: 'member' });
//   next();
// });

// USE THIS TO CALCULATE AGE USING DATE OF BIRTH AND CURRENT DATE
// benfSchema.method.calcAge(/^find/, function (next) {
//   console.log(Date.now());
//   // this points to the current query
//   // this.populate({ path: 'member' });
//   next();
// });

const Beneficiary = mongoose.model('Beneficiaries', benfSchema);

module.exports = Beneficiary;
