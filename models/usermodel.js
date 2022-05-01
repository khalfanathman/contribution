const mongoose = require('mongoose');
// const dummy = require('mongoose-dummy');

// const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
const userSchema = new mongoose.Schema({
  first_name: String,
  middle_name: String,
  last_name: String,
  welfare_ID: String, //refernce
  //   isActive: Boolean,
  role: {
    type: String,
    enum: [
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
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, 'Please confirm your password'],
  //   validate: {
  //     // This only works on CREATE and SAVE!!!
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //     message: 'Passwords are not the same!',
  //   },
  // },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const Member = mongoose.model('User', userSchema);
// const drand = [];
// for (let i = 0; i < 10; i++) {
//   let randomObject = dummy(Member, {
//     ignore: ignoredFields,
//     returnDate: true,
//   });
//   drand[i] = randomObject;
//   // const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
//   // console.log(`File written! : ${i} times`);
//   let member = drand[i];
//   Member.create(member);
//   // await User.create(users, { validateBeforeSave: false });
//   // await Review.create(reviews);
// }
// console.log('Data successfully loaded!');

module.exports = Member;
