function errorHandler(err, req, res, next) {
  console.error('🔥 Erro:', err);

  const status = (err && err.status) || 500;
  const message = (err && err.message) || 'Erro interno no servidor';

  res.status(status).json({
    error: true,
    message
  });
}

module.exports = errorHandler;
