// Estrutura de dados atualizada para o BarberPro V2

// Modelo de dados do Barbeiro
// Exemplo de modelo de dados do Barbeiro (os valores são exemplos, tipos estão nos comentários)
const modeloBarbeiro = {
    id: "", // string - Identificador único
    nome: "",
    email: "",
    telefone: "",
    foto: "", // string - URL da foto
    endereco: {
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: ""
    },
    tiposAtendimento: {
        barbearia: false, // boolean
        domicilio: false  // boolean
    },
    formasPagamento: {
        dinheiro: false,
        cartaoCredito: false,
        cartaoDebito: false,
        pix: false,
        transferencia: false
    },
    // Novos campos para pagamentos
    dadosPagamento: {
        pix: {
            chave: "",
            tipo: "" // string - CPF, CNPJ, Email, Telefone, Chave aleatória
        },
        dadosBancarios: {
            banco: "",
            agencia: "",
            conta: "",
            digito: "",
            tipoConta: "" // string - Corrente, Poupança
        }
    },
    momentoPagamento: {
        antecipado50: false,
        antecipado100: false,
        noAtendimento: false
    },
    servicos: [
        {
            id: "",
            nome: "",
            descricao: "",
            preco: 0, // number
            duracao: 0, // number - em minutos
            disponivel: false
        }
    ],
    horariosFuncionamento: {
        segunda: { inicio: "", fim: "", disponivel: false },
        terca: { inicio: "", fim: "", disponivel: false },
        quarta: { inicio: "", fim: "", disponivel: false },
        quinta: { inicio: "", fim: "", disponivel: false },
        sexta: { inicio: "", fim: "", disponivel: false },
        sabado: { inicio: "", fim: "", disponivel: false },
        domingo: { inicio: "", fim: "", disponivel: false }
    },
    avaliacoes: [
        {
            clienteId: "",
            nota: 0, // number
            comentario: "",
            data: "" // string ou Date
        }
    ],
    dataCadastro: "" // string ou Date
};

// Exemplo de modelo de dados do Cliente (os valores são exemplos, tipos estão nos comentários)
const modeloCliente = {
    id: "", // string - Identificador único
    nome: "",
    email: "",
    telefone: "",
    foto: "", // string - URL da foto
    endereco: {
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: ""
    },
    preferencias: {
        tipoAtendimento: "", // string - barbearia, domicilio
        servicos: [""], // array de string - IDs dos serviços de interesse
        formaPagamento: "", // string - dinheiro, cartaoCredito, cartaoDebito, pix, transferencia
        momentoPagamento: "" // string - antecipado50, antecipado100, noAtendimento
    },
    // Novo campo para favoritos
    favoritos: [""], // array de string - IDs dos barbeiros favoritos
    notificacoes: {
        email: false,
        sms: false,
        lembretes: false,
        promocoes: false
    },
    dataCadastro: "" // string ou Date
};
};
// Exemplo de modelo de dados de Agendamento (os valores são exemplos, tipos estão nos comentários)
const modeloAgendamento = {
    id: "", // string - Identificador único
    clienteId: "",
    barbeiroId: "",
    servicos: [
        {
            id: "",
            nome: "",
            preco: 0, // number
            duracao: 0 // number - em minutos
        }
    ],
    // Novo campo para duração total calculada
    duracaoTotal: 0, // number - em minutos, calculado com base na quantidade de serviços
    data: "", // string ou Date
    horario: "",
    local: "", // string - barbearia, domicilio
    endereco: { // Se for a domicílio
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: ""
    },
    formaPagamento: "", // string - dinheiro, cartaoCredito, cartaoDebito, pix, transferencia
    momentoPagamento: "", // string - antecipado50, antecipado100, noAtendimento
    valorTotal: 0, // number
    // Novos campos para comprovante
    comprovante: {
        necessario: false, // boolean - true para pix e transferência
        arquivo: "", // string - URL do arquivo
        dataEnvio: "", // string ou Date
        status: "" // string - pendente, aprovado, rejeitado
    },
    status: "", // string - pendente, confirmado, concluido, cancelado
    observacoes: "",
    dataCriacao: "" // string ou Date
};
    dataCriacao: "date"
};

// Funções utilitárias

// Função para calcular a duração total com base nos serviços selecionados
function calcularDuracaoTotal(servicos) {
    // Duração base do primeiro serviço
    let duracaoBase = servicos[0]?.duracao || 0;
    
    // Para cada serviço adicional, adiciona 30 minutos (meia hora)
    let duracaoAdicional = (servicos.length - 1) * 30;
    
    // Retorna a duração total
    return duracaoBase + duracaoAdicional;
}

// Função para verificar se um comprovante é necessário
function verificarNecessidadeComprovante(formaPagamento, momentoPagamento) {
    // Comprovante é necessário para PIX e transferência quando o pagamento é antecipado
    return (formaPagamento === 'pix' || formaPagamento === 'transferencia') && 
           (momentoPagamento === 'antecipado50' || momentoPagamento === 'antecipado100');
}

// Função para gerar horários disponíveis com base na agenda e duração do serviço
function gerarHorariosDisponiveis(barbeiro, data, duracaoServico) {
    // Implementação da lógica para gerar horários disponíveis
    // considerando a duração do serviço e bloqueando os horários adequadamente
    
    // Esta é uma implementação simplificada
    const horariosDisponiveis = [];
    const diaSemana = new Date(data).getDay();
    const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const horarioFuncionamento = barbeiro.horariosFuncionamento[diasSemana[diaSemana]];
    
    if (horarioFuncionamento.disponivel) {
        const inicio = parseInt(horarioFuncionamento.inicio.split(':')[0]);
        const fim = parseInt(horarioFuncionamento.fim.split(':')[0]);
        
        // Gera horários a cada 30 minutos
        for (let hora = inicio; hora < fim; hora++) {
            horariosDisponiveis.push(`${hora}:00`);
            horariosDisponiveis.push(`${hora}:30`);
        }
    }
    
    return horariosDisponiveis;
}

// Exporta os modelos e funções
export {
    modeloBarbeiro,
    modeloCliente,
    modeloAgendamento,
    calcularDuracaoTotal,
    verificarNecessidadeComprovante,
    gerarHorariosDisponiveis
};
