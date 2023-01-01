const Contribution = require('../models/contributionsModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const axios = require('axios');
const AppError = require('../utils/appError');

exports.getContribsStats = catchAsync(async (req, res, next) => {
  const stats = await Contribution.aggregate([
    {
      $match: { target: { $gte: 17 } },
    },
    {
      $group: {
        // _id: '$gender',
        _id: { $toUpper: '$gender' },
        numofcontrib: { $sum: 1 },
        totalcontributions: { $sum: '$amount_contributed' },
        avrgtarget: { $avg: '$target' },
        avrgContribution: { $avg: '$amount_contributed' },
      },
    },
    {
      $sort: {
        avrgtarget: 1,
      },
    },
    {
      // $match :{}
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
exports.getMontlyPlan = catchAsync(async (req, res, next) => {
  //calculate number of deaths in a year
  const year = req.params.year * 1;
  const plan = await Contribution.aggregate([
    {
      $unwind: '$end_date',
    },
    {
      $match: {
        end_date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$end_date' },
        numofcontrib: { $sum: 1 },
        contributionEvents: { $push: '$tittle' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOfContrib: -1 },
    },
    // {
    //   $limit: 1,
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

// /events-within/233/center/34.111745,-118.113491/unit/mi
exports.getContribsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const contribution = await Contribution.find({
    place_for_burial: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: 'success',
    results: contribution.length,
    data: {
      data: contribution,
    },
  });
});
exports.getAllContributions = factory.getAll(Contribution);
exports.getOneContribution = factory.getOne(Contribution);
exports.createContribution = factory.createOne(Contribution);
exports.updateContribution = factory.updateOne(Contribution);
exports.deleteContribution = factory.deleteOne(Contribution);
