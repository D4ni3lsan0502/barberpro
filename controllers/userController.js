const { validationResult } = require('express-validator');

exports.cadastrar = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  const { nome, email, senha, tipo } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hash, tipo });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    next(err);
  }
};
