function errorHandler(err, req, res, next) {
  console.error('🔥 Erro:', err);

  const status = err.status || 500;
  const message = err.message || 'Erro interno no servidor';

  res.status(status).json({
    error: true,
    message
  });
}

module.exports = errorHandler;
