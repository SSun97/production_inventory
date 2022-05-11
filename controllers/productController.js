const factory = require('./handlerFactroy');

exports.getAllProducts = factory.getAll();
exports.getProduct = factory.getOne();
exports.createProduct = factory.createOne();
exports.updateProduct = factory.updateOne();
exports.deleteProduct = factory.deleteOne();
