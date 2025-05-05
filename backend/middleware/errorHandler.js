module.exports = (err, req, res, next) => {
  // Log the full error (stack plus message) on the server
  console.error('Error message:', err.message);
  console.error(err.stack);

  // Send the real message back in JSON (and preserve any status code you set)
  const status = err.statusCode || 500;
  res.status(status).json({
    msg: err.message || 'Server Error'
  });
};
