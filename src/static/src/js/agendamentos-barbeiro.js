// Script para visualização completa de agendamentos do barbeiro
document.addEventListener("DOMContentLoaded", function() {
    // Inicializar componentes
    inicializarPagina();
    carregarAgendamentos();
    configurarEventListeners();
});

// Função para inicializar a página
function inicializarPagina() {
    // Para o Matheus Costa Barber, sempre consideramos ele logado como barbeiro
    const usuarioAtual = {
        id: "barb_matheuscosta",
        nome: "Matheus Costa",
        email: "matheus@barber.com",
        telefone: "(11) 99999-9999",
        tipo: "barbeiro",
        foto: "img/matheus_costa_barber_logo.png" // Usar o logo como foto
    };
    localStorage.setItem("barberpro_usuario_logado", JSON.stringify(usuarioAtual));
    
    // Atualizar informações do barbeiro na página
    atualizarInfoBarbeiro(usuarioAtual);
}

// Função para obter o usuário logado do localStorage (simplificado para Matheus Costa)
function obterUsuarioLogado() {
    return JSON.parse(localStorage.getItem("barberpro_usuario_logado"));
}

// Função para atualizar informações do barbeiro na página
function atualizarInfoBarbeiro(barbeiro) {
    // Atualizar nome e foto do barbeiro no sidebar e menu mobile
    const elementosNomeBarbeiro = document.querySelectorAll(".nome-barbeiro");
    const elementosFotoBarbeiro = document.querySelectorAll(".foto-barbeiro");
    
    elementosNomeBarbeiro.forEach(elemento => {
        if (elemento) elemento.textContent = barbeiro.nome || "Matheus Costa";
    });
    
    elementosFotoBarbeiro.forEach(elemento => {
        if (elemento) elemento.src = barbeiro.foto || "img/matheus_costa_barber_logo.png";
    });
    
    // Atualizar título da página
    const elementoTitulo = document.querySelector(".titulo-pagina");
    if (elementoTitulo) {
        elementoTitulo.textContent = `Agendamentos - ${barbeiro.nome}`;
    }
}

// Função para carregar agendamentos do barbeiro
function carregarAgendamentos() {
    const usuarioAtual = obterUsuarioLogado();
    if (!usuarioAtual || !usuarioAtual.id) return;
    
    // Usar o AgendamentoStorage para buscar agendamentos do barbeiro logado
    const agendamentos = window.BarberPro.AgendamentoStorage.getByBarbeiro(usuarioAtual.id);
    
    // Renderizar tabela de agendamentos
    renderizarTabelaAgendamentos(agendamentos);
}

// Função para renderizar tabela de agendamentos
function renderizarTabelaAgendamentos(agendamentos) {
    const tabelaBody = document.querySelector(".tabela-agendamentos tbody");
    if (!tabelaBody) return;
    
    // Limpar tabela
    tabelaBody.innerHTML = "";
    
    // Ordenar por data/horário
    agendamentos.sort((a, b) => {
        const dataA = new Date(`${a.data}T${a.horario}`);
        const dataB = new Date(`${b.data}T${b.horario}`);
        return dataA - dataB;
    });
    
    if (agendamentos.length === 0) {
        // Exibir mensagem se não houver agendamentos
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                Nenhum agendamento encontrado.
            </td>
        `;
        tabelaBody.appendChild(tr);
        return;
    }
    
    // Renderizar cada agendamento
    agendamentos.forEach(agendamento => {
        const tr = document.createElement("tr");
        
        // Formatar data e horário para exibição
        const dataObj = new Date(agendamento.data);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        dataObj.setHours(0, 0, 0, 0);
        
        let dataExibicao = "";
        if (dataObj.getTime() === hoje.getTime()) {
            dataExibicao = "Hoje";
        } else if (dataObj.getTime() === hoje.getTime() + 86400000) {
            dataExibicao = "Amanhã";
        } else {
            dataExibicao = dataObj.toLocaleDateString("pt-BR");
        }
        
        // Buscar informações do cliente
        const cliente = agendamento.cliente; // Cliente já vem no objeto agendamento
        
        // Determinar serviços
        let servicoNome = "Serviço não especificado";
        let servicoDuracao = "";
        
        if (agendamento.servicos && agendamento.servicos.length > 0) {
            servicoNome = agendamento.servicos.map(s => s.nome).join(" + ");
            servicoDuracao = `${agendamento.duracaoTotal || 30} min`;
        }
        
        // Determinar classe de status
        let statusClass = "";
        switch (agendamento.status) {
            case "confirmado":
                statusClass = "status-badge confirmed";
                break;
            case "pendente":
                statusClass = "status-badge pending";
                break;
            case "concluido":
                statusClass = "status-badge completed";
                break;
            case "cancelado":
                statusClass = "status-badge canceled";
                break;
            default:
                statusClass = "status-badge pending";
        }
        
        // Formatar valor para exibição
        const valorFormatado = agendamento.valorTotal ? 
            `R$ ${agendamento.valorTotal.toFixed(2).replace(".", ",")}` : 
            "R$ 0,00";
        
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full" src="${cliente.foto || "https://randomuser.me/api/portraits/men/1.jpg"}" alt="">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-white">${cliente.nome || "Cliente"}</div>
                        <div class="text-sm text-gray-400">${cliente.telefone || ""}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">${servicoNome}</div>
                <div class="text-sm text-gray-400">${servicoDuracao}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">${dataExibicao}, ${agendamento.horario}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">${agendamento.local === "barbearia" ? "Na Barbearia" : "A Domicílio"}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">${valorFormatado}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="${statusClass}">${agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                ${agendamento.status === "pendente" ? `
                    <button class="text-white hover:text-gray-300 mr-3 btn-confirmar" data-id="${agendamento.id}">
                        <i class="fas fa-check"></i>
                    </button>
                ` : ""}
                ${agendamento.status !== "cancelado" && agendamento.status !== "concluido" ? `
                    <button class="text-red-600 hover:text-red-700 mr-3 btn-cancelar" data-id="${agendamento.id}">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ""}
                <button class="text-gray-400 hover:text-gray-300 btn-detalhes" data-id="${agendamento.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tabelaBody.appendChild(tr);
    });
    
    // Adicionar event listeners para os botões de ação
    adicionarEventListenersAcoes();
}

// Função para buscar informações do cliente (não mais necessária, cliente já está no agendamento)
function buscarCliente(clienteId) {
    // Esta função não deve ser mais chamada, pois o cliente já está no objeto agendamento
    console.warn("buscarCliente foi chamada, mas o cliente já deve estar no objeto agendamento.");
    return {};
}

// Função para adicionar event listeners aos botões de ação
function adicionarEventListenersAcoes() {
    // Botões de confirmar agendamento
    document.querySelectorAll(".btn-confirmar").forEach(btn => {
        btn.addEventListener("click", function() {
            const agendamentoId = this.getAttribute("data-id");
            confirmarAgendamento(agendamentoId);
        });
    });
    
    // Botões de cancelar agendamento
    document.querySelectorAll(".btn-cancelar").forEach(btn => {
        btn.addEventListener("click", function() {
            const agendamentoId = this.getAttribute("data-id");
            cancelarAgendamento(agendamentoId);
        });
    });
    
    // Botões de detalhes do agendamento
    document.querySelectorAll(".btn-detalhes").forEach(btn => {
        btn.addEventListener("click", function() {
            const agendamentoId = this.getAttribute("data-id");
            mostrarDetalhesAgendamento(agendamentoId);
        });
    });
}

// Função para confirmar agendamento
function confirmarAgendamento(agendamentoId) {
    if (!agendamentoId) return;
    
    // Atualizar status do agendamento
    const atualizado = window.BarberPro.AgendamentoStorage.update(agendamentoId, {
        status: "confirmado"
    });
    
    if (atualizado) {
        // Recarregar agendamentos
        carregarAgendamentos();
        
        // Exibir notificação
        exibirNotificacao("Agendamento confirmado com sucesso!", "success");
    } else {
        exibirNotificacao("Erro ao confirmar agendamento.", "error");
    }
}

// Função para cancelar agendamento
function cancelarAgendamento(agendamentoId) {
    if (!agendamentoId) return;
    
    // Confirmar cancelamento
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;
    
    // Atualizar status do agendamento
    const atualizado = window.BarberPro.AgendamentoStorage.update(agendamentoId, {
        status: "cancelado"
    });
    
    if (atualizado) {
        // Recarregar agendamentos
        carregarAgendamentos();
        
        // Exibir notificação
        exibirNotificacao("Agendamento cancelado com sucesso!", "success");
    } else {
        exibirNotificacao("Erro ao cancelar agendamento.", "error");
    }
}

// Função para mostrar detalhes do agendamento
function mostrarDetalhesAgendamento(agendamentoId) {
    if (!agendamentoId) return;
    
    // Buscar agendamento
    const agendamentos = window.BarberPro.AgendamentoStorage.getAll();
    const agendamento = agendamentos.find(a => a.id === agendamentoId);
    
    if (!agendamento) {
        exibirNotificacao("Agendamento não encontrado.", "error");
        return;
    }
    
    // Buscar cliente
    const cliente = agendamento.cliente; // Cliente já está no objeto agendamento
    
    // Criar modal de detalhes
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center";
    
    // Formatar data para exibição
    const dataObj = new Date(agendamento.data);
    const dataFormatada = dataObj.toLocaleDateString("pt-BR");
    
    // Formatar serviços
    let servicosHTML = "<p class=\"text-gray-500\">Nenhum serviço selecionado</p>";
    if (agendamento.servicos && agendamento.servicos.length > 0) {
        servicosHTML = agendamento.servicos.map(servico => `
            <div class="flex justify-between items-center mb-2">
                <span class=\"text-white\">${servico.nome}</span>
                <span class=\"text-white\">R$ ${servico.preco.toFixed(2).replace(".", ",")}</span>
            </div>
        `).join("");
    }
    
    // Determinar classe de status
    let statusClass = "";
    switch (agendamento.status) {
        case "confirmado":
            statusClass = "bg-green-600 text-black";
            break;
        case "pendente":
            statusClass = "bg-white text-black";
            break;
        case "concluido":
            statusClass = "bg-white text-black";
            break;
        case "cancelado":
            statusClass = "bg-red-600 text-white";
            break;
        default:
            statusClass = "bg-white text-black";
    }
    
    modal.innerHTML = `
        <div class="bg-slate-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div class="flex justify-between items-center p-6 border-b border-gray-700">
                <h3 class="text-lg font-semibold text-white">Detalhes do Agendamento</h3>
                <button class="text-gray-400 hover:text-gray-300 focus:outline-none" id="fechar-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-6">
                <div class="mb-6">
                    <div class="flex items-center mb-4">
                        <img src="${cliente.foto || "https://randomuser.me/api/portraits/men/1.jpg"}" alt="Cliente" class="w-12 h-12 rounded-full mr-4">
                        <div>
                            <h4 class="font-medium text-white">${cliente.nome || "Cliente"}</h4>
                            <p class="text-sm text-gray-400">${cliente.telefone || ""}</p>
                        </div>
                    </div>
                    <div class="inline-block px-3 py-1 rounded-full ${statusClass} text-sm font-semibold mb-4">
                        ${agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p class="text-sm text-gray-400">Data</p>
                        <p class="font-medium text-white">${dataFormatada}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-400">Horário</p>
                        <p class="font-medium text-white">${agendamento.horario}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-400">Local</p>
                        <p class="font-medium text-white">${agendamento.local === "barbearia" ? "Na Barbearia" : "A Domicílio"}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-400">Duração</p>
                        <p class="font-medium text-white">${agendamento.duracaoTotal || 30} min</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-medium text-white mb-2">Serviços</h4>
                    <div class="bg-slate-900 p-3 rounded">
                        ${servicosHTML}
                        <div class="border-t border-gray-700 mt-2 pt-2 flex justify-between font-medium text-white">
                            <span>Total</span>
                            <span>R$ ${agendamento.valorTotal ? agendamento.valorTotal.toFixed(2).replace(".", ",") : "0,00"}</span>
                        </div>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-medium text-white mb-2">Pagamento</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-400">Forma</p>
                            <p class="font-medium text-white">${formatarFormaPagamento(agendamento.formaPagamento)}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-400">Momento</p>
                            <p class="font-medium text-white">${formatarMomentoPagamento(agendamento.momentoPagamento)}</p>
                        </div>
                    </div>
                </div>
                
                ${agendamento.observacoes ? `
                <div class="mb-6">
                    <h4 class="font-medium text-white mb-2">Observações</h4>
                    <p class="text-gray-400">${agendamento.observacoes}</p>
                </div>
                ` : ""}

                ${agendamento.local === "domicilio" ? `
                <div class="mb-6">
                    <h4 class="font-medium text-white mb-2">Endereço de Atendimento</h4>
                    <p class="text-gray-400">${agendamento.endereco.rua}, ${agendamento.endereco.numero} ${agendamento.endereco.complemento ? `, ${agendamento.endereco.complemento}` : ""}</p>
                    <p class="text-gray-400">${agendamento.endereco.bairro}, ${agendamento.endereco.cidade} - ${agendamento.endereco.estado}</p>
                    <p class="text-gray-400">CEP: ${agendamento.endereco.cep || "N/A"}</p>
                </div>
                ` : ""}

            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    document.getElementById("fechar-modal").addEventListener("click", function() {
        modal.remove();
    });
    
    // Fechar modal ao clicar fora
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Funções auxiliares para formatação
function formatarFormaPagamento(forma) {
    switch (forma) {
        case "pix": return "Pix";
        case "cartaoCredito": return "Cartão de Crédito";
        case "dinheiro": return "Dinheiro";
        case "local": return "Pagar no Local";
        default: return forma;
    }
}

function formatarMomentoPagamento(momento) {
    switch (momento) {
        case "antecipado100": return "Antecipado (100%)";
        case "antecipado50": return "Antecipado (50%)";
        case "noAtendimento": return "No Atendimento";
        default: return momento;
    }
}

// Função para exibir notificações (simples)
function exibirNotificacao(mensagem, tipo) {
    const notificacaoDiv = document.createElement("div");
    notificacaoDiv.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${tipo === "success" ? "bg-green-600" : "bg-red-600"}`;
    notificacaoDiv.textContent = mensagem;
    document.body.appendChild(notificacaoDiv);
    
    setTimeout(() => {
        notificacaoDiv.remove();
    }, 3000);
}

// Configurar event listeners para o menu lateral (já existente no dashboard)
function configurarEventListeners() {
    // Implementar lógica de menu lateral se necessário
}


