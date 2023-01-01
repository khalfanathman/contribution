// const slugify = require('slugify');
const Contribution = require('../models/contributionsModel');
const Member = require('../models/usermodel');
const Dependant = require('../models/dependantModel');
const Beneficiaries = require('../models/beneficiaryModel');
const catchAsync = require('../utils/catchAsync');
const trasnactModel = require('../models/trasnactModel');
const factory = require('./handlerFactory');

const AppError = require('../utils/appError');

exports.landingpage = catchAsync(async (req, res, next) => {
  const contributions = await Contribution.find();
  res.status(200).render('index', {
    contributions,
  });
  // contributions.tittle = slugify(contributions.tittle, { lower: true });
  // const slug = contributions.tittle;
});
exports.makeContribution = catchAsync(async (req, res, next) => {
  const contrib = await Contribution.findOne({
    id: req.params.contid,
  }).populate({
    path: 'members',
  });
  const trasnact = await trasnactModel
    .find({
      tittle: req.params.contid,
    })
    .populate({
      path: 'member',
    });
  // console.log(req.params);
  console.log(contrib);
  res.status(200).render('Contribute', {
    tittle: `${contrib.tittle}`,
    contrib,
  });
});
exports.getOneContribution = catchAsync(async (req, res, next) => {
  const contrib = await Contribution.findOne({
    id: req.params.id,
  }).populate({
    path: 'members',
  });
  const trasnact = await trasnactModel
    .find({
      tittle: req.params.slug,
    })
    .populate({
      path: 'member',
    });

  // console.log(trasnact);
  // console.log(trasnact[0].member.first_name);
  // if (!contrib) {
  //   return next(new AppError('There is no such contribution', 404));
  // }
  res.status(200).render('Contribution', {
    tittle: ` ${contrib.tittle} Contribution`,
    trasnact,
    contrib,
  });
});

exports.getDependents = catchAsync(async (req, res, next) => {
  const member = await Member.findById(req.params.memberId).populate({
    path: 'dependents',
  });

  const dependants = member.dependents;
  res.status(200).render('dependents', {
    tittle: 'Dependents',
    dependants,
  });
});
exports.getDependent = catchAsync(async (req, res, next) => {
  const dependant = await Dependant.findById(req.params.dependantId);
  res.status(200).render('dependent', {
    tittle: 'Dependents',
    dependant,
  });
});
exports.DependentForm = catchAsync(async (req, res, next) => {
  const dependant = await Dependant.findById(req.params.dependantId);
  console.log('this is the dependants ', dependant);
  res.status(200).render('dependent', {
    tittle: 'Dependents',
    dependant,
  });
});
exports.getResponse = async (req, res, next) => {
  try {
    console.log('console 1 response', req.body);
    const rez = JSON.stringify(req.body.Body);
    if (rez) {
      const rez1 = JSON.parse(rez);
      console.log(rez);
      const { ResultCode, MerchantRequestID, CheckoutRequestID, ResultDesc } =
        rez1.stkCallback;
      console.log(ResultDesc);
      console.log(MerchantRequestID);
      console.log(CheckoutRequestID);
      if (ResultCode != 0) {
        res.status(200).render('response', {
          tittle: 'Mpesa Response',
          success: true,
        });
      } else {
        next();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getAccount = (req, res) => {
  res.status(200).render('profile', {
    tittle: 'Your account',
  });
};
exports.getMembers = catchAsync(async (req, res) => {
  const members = await Member.find();
  const member = req.member;

  res.status(200).render('data', {
    members,
    member,
  });
});

exports.getSavings = catchAsync(async (req, res, next) => {
  const member = await Member.findById(req.member.id).populate({
    path: 'savings',
  });

  console.log(member);
  res.status(200).render('savings', {
    tittle: 'Savings Account',
    member,
  });
});
exports.getBeneficiaries = catchAsync(async (req, res, next) => {
  const member = await Member.findById(req.params.user_id).populate({
    path: 'beneficiaries',
  });
  // console.log(add);
  const benef = member.beneficiaries;
  console.log(benef);
  res.status(200).render('beneficiaries', {
    tittle: 'Beneficiaries',
    benef,
  });
});

exports.loginMember = catchAsync(async (req, res) => {
  res.status(200).render('login');
});
exports.updateMemberData = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const updatedMember = await Member.findByIdAndUpdate(
    req.member.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('profile', {
    tittle: 'Your account',
    user: updatedMember,
  });
});
