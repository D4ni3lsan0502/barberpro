const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

exports.criar = async (req, res, next) => {
  try {
    const { barbeiroId, servicoId, data } = req.body;

    const servico = await Service.findById(servicoId);
    if (!servico) return res.status(404).json({ message: 'Serviço não encontrado' });

    const agendamento = await Appointment.create({
      clienteId: req.user.id,
      barbeiroId,
      servicoId,
      data
    });

    res.status(201).json(agendamento);
  } catch (err) {
    next(err);
  }
};

exports.listarMeus = async (req, res, next) => {
  try {
    const agendamentos = await Appointment.find({
      $or: [{ clienteId: req.user.id }, { barbeiroId: req.user.id }]
    }).populate('servicoId barbeiroId clienteId');

    res.json(agendamentos);
  } catch (err) {
    next(err);
  }
};

exports.cancelar = async (req, res, next) => {
  try {
    const agendamento = await Appointment.findById(req.params.id);
    if (!agendamento) return res.status(404).json({ message: 'Agendamento não encontrado' });

    if (
      agendamento.clienteId.toString() !== req.user.id &&
      agendamento.barbeiroId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    agendamento.status = 'cancelado';
    await agendamento.save();

    res.json({ message: 'Agendamento cancelado' });
  } catch (err) {
    next(err);
  }
};
