const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "An internal server error occurred" });
};

module.exports = { errorHandler };