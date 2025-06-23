const Service = require('../models/Service');

exports.criar = async (req, res, next) => {
  try {
    const { nome, preco, descricao } = req.body;
    const service = await Service.create({
      nome,
      preco,
      descricao,
      barbeiroId: req.user.id
    });
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

exports.listar = async (req, res, next) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    next(err);
  }
};

exports.deletar = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Serviço não encontrado' });

    if (service.barbeiroId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    await service.deleteOne();
    res.json({ message: 'Serviço deletado' });
  } catch (err) {
    next(err);
  }
};
