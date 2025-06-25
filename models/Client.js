import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Client', clientSchema, 'clients');
