const Members = require('../models/usermodel');

exports.getAllUsers = async (req, res) => {
  try {
    console.log(res.body);
    const members = await Members.find();

    res.status(200).json({
      status: 'success',
      members,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      Message: error,
    });
  }
};
exports.getOneUser = async (req, res) => {
  try {
    const member = Members.findById(req.param.user_ID);
    res.status(200).json({
      status: 'success',
      member,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      Message: error,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newMember = await Members.create(req.body);
    res.status(200).json({
      status: 'succes',
      member: newMember,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      Message: ' route note yet defined',
    });
  }
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' route note yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' route note yet defined',
  });
};
