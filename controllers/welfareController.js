const Welfare = require('../models/welfareModel');
const factory = require('./handlerFactory');

exports.getAllWgroups = factory.getAll(Welfare);
exports.getOneWgroup = factory.getOne(Welfare);
exports.createWgroup = factory.createOne(Welfare);
exports.updateWgroup = factory.updateOne(Welfare);
exports.deleteWgroup = factory.deleteOne(Welfare);
