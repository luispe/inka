module.exports = function(error, req, res, next) {
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(status).json({ message: message });
};
