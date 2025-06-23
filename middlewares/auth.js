const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não está definido nas variáveis de ambiente.');
      return res.status(500).json({ message: 'Erro interno de autenticação.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Erro no token:', err);
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
