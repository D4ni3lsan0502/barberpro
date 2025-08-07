// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  tipo: String // 'cliente' ou 'barbeiro'
});

module.exports = mongoose.model('User', userSchema);
