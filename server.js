require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const errorHandler = require('./middlewares/errorHandler');

// 🎯 Uso das rotas
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

const app = express();
const PORT = process.env.PORT || 3000;

// 🚨 Verificação de variáveis essenciais
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('❌ Variáveis de ambiente MONGODB_URI ou JWT_SECRET não configuradas.');
  process.exit(1);
}

// 🌐 Middlewares Globais
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('./middlewares/rateLimit');

const corsOptions = {
  origin: ['https://teuapp.com', 'http://localhost:3000'], // Domínios permitidos
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(rateLimit);
app.use(mongoSanitize());
app.use(xss());
app.use(express.json());
app.use(express.static('public'));

// 🔗 Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB conectado!'))
  .catch(err => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

// 🔐 Middleware de autenticação
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next({ status: 401, message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next({ status: 401, message: 'Token inválido.' });
  }
}

// 👤 Rota: Cadastro de usuário
app.post('/api/cadastro', async (req, res, next) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    if (!nome || !email || !senha || !tipo) {
      throw { status: 400, message: 'Todos os campos são obrigatórios.' };
    }

    const hash = await bcrypt.hash(senha, 10);
    const user = await User.create({ nome, email, senha: hash, tipo });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    if (err.code === 11000) {
      err.status = 400;
      err.message = 'E-mail já está em uso.';
    }
    next(err);
  }
});

// 🔑 Rota: Login
app.post('/api/login', async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      throw { status: 400, message: 'Email e senha são obrigatórios.' };
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw { status: 400, message: 'Usuário não encontrado.' };
    }

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) {
      throw { status: 400, message: 'Senha incorreta.' };
    }

    const token = jwt.sign(
      { id: user._id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      }
    });
  } catch (err) {
    next(err);
  }
});

// 🔐 Rota protegida: Perfil

const { swaggerUi, specs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 🛑 Middleware global de tratamento de erros
app.use(errorHandler);

// 🚀 Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
