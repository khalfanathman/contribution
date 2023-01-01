const Dependant = require('../models/dependantModel');
const Member = require('../models/usermodel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
exports.setUserId = (req, res, next) => {
  // console.log(req.params);
  if (!req.body.member) req.body.member = req.member.id;
  next();
};

// exports.getAlldependant = async (req, res, next) => {
//   const member = await Member.findById(req.params.user_id).populate({
//     path: 'dependents',
//   });
//   console.log(req.params.user_id);
//   console.log(member);
//   const depend = await member.dependents;
//   const Dob = await Member.aggregate([
//     {
//       $project: {
//         date: dependents['$dateOfBirth'],
//         DependantAge: {
//           $divide: [
//             { $subtract: [new Date(), '$dateOfBirth'] },
//             365 * 24 * 60 * 60 * 1000,
//           ],
//         },
//       },
//     },
//   ]);
//   res.status(200).json({
//     status: 'success',
//     results: depend.length,
//     data: {
//       depend,
//       dates: Dob,
//     },
//   });
// };
exports.updatedependant = catchAsync(async (req, res, next) => {
  const depend = await Dependant.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { runValidators: false }
  );
  await Dependant.updateBeneficiary(depend, req.params.id);
  // await Dependant.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: {
      depend,
    },
  });
});

exports.getAlldependant = factory.getAll(Dependant);
exports.getOnedependant = factory.getOne(Dependant, {
  path: 'member',
  select: '-__v ',
});
exports.createdependant = factory.createOne(Dependant);
exports.deletedependant = factory.deleteOne(Dependant);
