// A module to handle uncaught exceptions
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};
