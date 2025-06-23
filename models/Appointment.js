const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  barbeiroId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  servicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  data: { type: Date, required: true },
  status: { type: String, enum: ['pendente', 'confirmado', 'cancelado'], default: 'pendente' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
