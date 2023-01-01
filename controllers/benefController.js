const Beneficiary = require('./../models/beneficiaryModel');
const factory = require('./../controllers/handlerFactory');

exports.getOneBeneficiary = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' rote note yet defined',
  });
};

exports.createBeneficiary = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' route note yet defined',
  });
};
exports.updateBeneficiary = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' route note yet defined',
  });
};
exports.deleteBeneficiary = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' route note yet defined',
  });
};
exports.getAllBeneficiaries = factory.getAll(Beneficiary);
exports.getOneUser = factory.getOne(Beneficiary, { path: 'dependents' });
exports.updateUser = factory.updateOne(Beneficiary);
exports.deleteUser = factory.deleteOne(Beneficiary);
