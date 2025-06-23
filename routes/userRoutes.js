const { body } = require('express-validator');
const { cadastrar, login } = require('../controllers/userController');

router.post('/cadastro',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('Senha precisa ter no mínimo 6 caracteres'),
    body('tipo').isIn(['cliente', 'barbeiro']).withMessage('Tipo deve ser cliente ou barbeiro')
  ],
  cadastrar
);
