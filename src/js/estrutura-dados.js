// Estrutura de dados para o BarberPro

// Estrutura para Barbeiro
/**
 * @typedef {Object} BarbeiroDadosEstrutura
 * @property {string} id
 * @property {string} nome
 * @property {string} email
 * @property {string} senha
 * @property {string} telefone
 * @property {string} foto
 * @property {string[]} especialidades
 * @property {string} descricao
 * @property {number} experiencia
 * @property {{barbearia: boolean, domicilio: boolean, raioAtendimentoDomicilio: number}} tiposAtendimento
 * @property {{rua: string, numero: string, complemento: string, bairro: string, cidade: string, estado: string, cep: string, coordenadas: {latitude: number, longitude: number}}} endereco
 * @property {string} contatoPreferencial
 * @property {{instagram: string, facebook: string, twitter: string}} redesSociais
 * @property {{dinheiro: boolean, pix: boolean, cartaoCredito: boolean, cartaoDebito: boolean, transferencia: boolean}} formasPagamento
 * @property {{antecipado50: boolean, antecipado100: boolean, noAtendimento: boolean}} momentoPagamento
 * @property {{diaSemana: number, inicio: string, fim: string, intervalo: {inicio: string, fim: string}}[]} horarioTrabalho
 * @property {{id: string, nome: string, descricao: string, preco: number, duracao: number, disponivel: boolean}[]} servicos
 * @property {{intervaloEntreAgendamentos: number, antecedenciaMinima: number, antecedenciaMaxima: number, permiteCancelamento: boolean, tempoMinimoCancelamento: number}} configuracoesAgendamento
 * @property {{clientesAtendidos: number, avaliacaoMedia: number, faturamentoMensal: number}} estatisticas
 * @property {{email: boolean, sms: boolean, push: boolean}} notificacoes
 * @property {Date} dataCadastro
 * @property {Date} ultimoAcesso
 */

/** @type {BarbeiroDadosEstrutura} */
const barbeiroDadosEstrutura = {
  id: "",
  nome: "",
  email: "",
  senha: "",
  telefone: "",
  foto: "",
  especialidades: [],
  descricao: "",
  experiencia: 0,
  tiposAtendimento: {
    barbearia: false,
    domicilio: false,
    raioAtendimentoDomicilio: 0
  },
  endereco: {
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    coordenadas: {
      latitude: 0,
      longitude: 0
    }
  },
  contatoPreferencial: "",
  redesSociais: {
    instagram: "",
    facebook: "",
    twitter: ""
  },
  formasPagamento: {
    dinheiro: false,
    pix: false,
    cartaoCredito: false,
    cartaoDebito: false,
    transferencia: false
  },
  momentoPagamento: {
    antecipado50: false,
    antecipado100: false,
    noAtendimento: false
  },
  horarioTrabalho: [],
  servicos: [],
  configuracoesAgendamento: {
    intervaloEntreAgendamentos: 0,
    antecedenciaMinima: 0,
    antecedenciaMaxima: 0,
    permiteCancelamento: false,
    tempoMinimoCancelamento: 0
  },
  estatisticas: {
    clientesAtendidos: 0,
    avaliacaoMedia: 0,
    faturamentoMensal: 0
  },
  notificacoes: {
    email: false,
    sms: false,
    push: false
  },
  dataCadastro: new Date(),
  ultimoAcesso: new Date()
};

// Estrutura para Cliente
const clienteDadosEstrutura = {
  // Dados pessoais
  id: "string", // Identificador único
  nome: "string",
  email: "string",
  senha: "string (hash)",
  telefone: "string",
  foto: "string (URL)",
  
  // Endereço para atendimento a domicílio
  endereco: {
    rua: "string",
    numero: "string",
    complemento: "string",
    bairro: "string",
    cidade: "string",
    estado: "string",
    cep: "string",
    coordenadas: {
      latitude: "number",
      longitude: "number"
    }
  },
  
  // Preferências
  preferencias: {
    tipoAtendimentoPreferido: "string", // "barbearia" ou "domicilio"
    barbeirosPreferidos: ["string"], // IDs dos barbeiros favoritos
    servicosFrequentes: ["string"], // IDs dos serviços mais utilizados
    formaPagamentoPreferida: "string" // Ex: "pix", "dinheiro", "cartao"
  },
  
  // Histórico de agendamentos
  historicoAgendamentos: [
    {
      id: "string",
      barbeiroId: "string",
      servicoId: "string",
      data: "date",
      horario: "string",
      local: "string", // "barbearia" ou "domicilio"
      status: "string", // "agendado", "concluido", "cancelado"
      valorPago: "number",
      formaPagamento: "string",
      momentoPagamento: "string", // "antecipado", "no_atendimento"
      avaliacao: {
        nota: "number", // 1-5
        comentario: "string"
      }
    }
  ],
  
  // Notificações
  notificacoes: {
    email: "boolean",
    sms: "boolean",
    push: "boolean"
  },
  
  dataCadastro: "date",
  ultimoAcesso: "date"
};

// Estrutura para Agendamento
const agendamentoDadosEstrutura = {
  id: "string",
  clienteId: "string",
  barbeiroId: "string",
  
  // Detalhes do agendamento
  servicos: [
    {
      id: "string",
      nome: "string",
      preco: "number",
      duracao: "number" // Em minutos
    }
  ],
  
  // Data e horário
  data: "date",
  horarioInicio: "string",
  horarioFim: "string",
  
  // Local e pagamento
  local: "string", // "barbearia" ou "domicilio"
  endereco: {
    // Se for a domicílio, usa o endereço do cliente
    // Se for na barbearia, usa o endereço do barbeiro
  },
  
  // Pagamento
  valorTotal: "number",
  formaPagamento: "string",
  momentoPagamento: "string", // "antecipado_50", "antecipado_100", "no_atendimento"
  statusPagamento: "string", // "pendente", "parcial", "pago"
  
  // Status do agendamento
  status: "string", // "agendado", "confirmado", "em_andamento", "concluido", "cancelado"
  
  // Observações
  observacoesCliente: "string",
  observacoesBarbeiro: "string",
  
  // Datas de controle
  dataCriacao: "date",
  dataAtualizacao: "date"
};
