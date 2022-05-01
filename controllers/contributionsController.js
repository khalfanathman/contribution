const Contribution = require('../models/contributionsModel');
const APIFeatures = require('../utils/apiFeatures');

// ROUTE HANDLERS
exports.getAllContributions = async (req, res) => {
  try {
    // EXECUTE THE QUREY
    const features = new APIFeatures(Contribution.find(), req.query)
      .filter()
      .sort()
      .limiFields()
      .paginate();
    const contributions = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: contributions.length,
      reqAt: req.requestTime,
      data: {
        contributions,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getOneContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(
      req.params.contribution_ID
    );
    res.status(200).json({
      status: 'success',
      data: {
        contribution,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      // data: {
      //   contribution,
      // },
    });
  }
};
exports.createContribution = async (req, res) => {
  try {
    const newContrib = await Contribution.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        contributions: newContrib,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid data sent',
    });
  }
};
exports.updateContribution = async (req, res) => {
  try {
    const updatedContrib = await Contribution.findByIdAndUpdate(
      req.params.contribution_ID,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        contribution: updatedContrib,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteContribution = async (req, res) => {
  try {
    await Contribution.findByIdAndDelete(req.params.contribution_ID);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'error',
    });
  }
};

exports.getContribsStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'error',
    });
  }
};
exports.getMontlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
