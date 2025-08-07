// Integração do sistema de agendamentos com interface do usuário
document.addEventListener("DOMContentLoaded", function() {
  // Verificar se estamos na página de agendamento
  const isAgendamentoPage = window.location.pathname.includes("agendamentos.html");
  
  // Inicializar componentes de agendamento
  if (isAgendamentoPage) {
    initAgendamentoPage();
  }
  
  // Inicializar página de agendamento
  function initAgendamentoPage() {
    const servicosContainer = document.getElementById("etapa-1");
    const btnEtapa1 = document.getElementById("btn-etapa-1");
    const btnVoltarEtapa1 = document.getElementById("btn-voltar-etapa-1");
    const btnEtapa2 = document.getElementById("btn-etapa-2");
    const agendamentoForm = document.getElementById("agendamento-form");

    const etapa1Div = document.getElementById("etapa-1");
    const etapa2Div = document.getElementById("etapa-2");
    const etapa3Div = document.getElementById("etapa-3");

    const etapaTexto = document.getElementById("etapa-texto");
    const etapaDescricao = document.getElementById("etapa-descricao");
    const progressBar = document.getElementById("progress-bar");

    const precoTotalSpan = document.getElementById("preco-total");
    const tempoTotalSpan = document.getElementById("tempo-total");

    const confirmServicosSpan = document.getElementById("confirm-servicos");
    const confirmDataSpan = document.getElementById("confirm-data");
    const confirmHorarioSpan = document.getElementById("confirm-horario");
    const confirmLocalSpan = document.getElementById("confirm-local");
    const confirmEnderecoContainer = document.getElementById("confirm-endereco-container");
    const confirmEnderecoSpan = document.getElementById("confirm-endereco");
    const confirmPrecoTotalSpan = document.getElementById("confirm-preco-total");

    const nomeClienteInput = document.getElementById("nome-cliente");
    const emailClienteInput = document.getElementById("email-cliente");
    const telefoneClienteInput = document.getElementById("telefone-cliente");

    const localBarbeariaRadio = document.getElementById("local-barbearia");
    const localDomicilioRadio = document.getElementById("local-domicilio");
    const enderecoDomicilioDiv = document.getElementById("endereco-domicilio");

    const ruaInput = document.getElementById("rua");
    const numeroInput = document.getElementById("numero");
    const complementoInput = document.getElementById("complemento");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const estadoSelect = document.getElementById("estado");

    const pixInfoDiv = document.getElementById("pix-info");
    const pagamentoPixRadio = document.getElementById("pagamento-pix");
    const pagamentoLocalRadio = document.getElementById("pagamento-local");
    const pixValorSpan = document.getElementById("pix-valor");
    const btnConfirmarAgendamento = document.getElementById("btn-confirmar-agendamento");

    const calendarDiv = document.getElementById("calendar");
    const timeSlotsDiv = document.getElementById("time-slots");

    let agendamentoAtual = {
      servicos: [],
      data: null,
      horario: null,
      local: "barbearia",
      endereco: {},
      cliente: {},
      formaPagamento: "pix",
      precoTotal: 0,
      duracaoTotal: 0,
      status: "pendente"
    };

    const barbeiroMatheus = {
      id: "barb_matheuscosta",
      nome: "Matheus Costa",
      email: "matheus@barber.com",
      telefone: "(11) 99999-9999",
      foto: "https://randomuser.me/api/portraits/men/32.jpg",
      servicos: [
        {
          id: "serv_corte",
          nome: "Corte Masculino",
          preco: 50.00,
          duracao: 40
        },
        {
          id: "serv_barba",
          nome: "Barba Clássica",
          preco: 40.00,
          duracao: 30
        },
        {
          id: "serv_corte_barba",
          nome: "Corte + Barba",
          preco: 80.00,
          duracao: 70
        },
        {
          id: "serv_sobrancelha",
          nome: "Sobrancelha",
          preco: 25.00,
          duracao: 15
        }
      ]
    };

    // Renderizar serviços na Etapa 1
    function renderizarServicos() {
      const servicosHtml = barbeiroMatheus.servicos.map(servico => `
        <div class="flex items-center p-3 border border-gray-700 rounded-md">
          <input type="checkbox" id="servico-${servico.id}" name="servicos" value="${servico.id}" class="servico-checkbox mr-3" data-duracao="${servico.duracao}" data-preco="${servico.preco}">
          <div class="flex-1">
            <label for="servico-${servico.id}" class="block font-medium text-white">${servico.nome}</label>
            <p class="text-sm text-gray-400">${servico.nome}</p>
          </div>
          <div class="text-right">
            <p class="font-medium text-white">R$ ${servico.preco.toFixed(2).replace(".", ",")}</p>
            <p class="text-xs text-gray-400">${servico.duracao} min</p>
          </div>
        </div>
      `).join("");
      servicosContainer.querySelector(".space-y-3").innerHTML = servicosHtml;

      document.querySelectorAll(".servico-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", atualizarResumoServicos);
      });
    }

    function atualizarResumoServicos() {
      agendamentoAtual.servicos = [];
      let totalPreco = 0;
      let totalDuracao = 0;

      document.querySelectorAll(".servico-checkbox:checked").forEach(checkbox => {
        const servicoId = checkbox.value;
        const servico = barbeiroMatheus.servicos.find(s => s.id === servicoId);
        if (servico) {
          agendamentoAtual.servicos.push(servico);
          totalPreco += servico.preco;
          totalDuracao += servico.duracao;
        }
      });

      agendamentoAtual.precoTotal = totalPreco;
      agendamentoAtual.duracaoTotal = totalDuracao;

      precoTotalSpan.textContent = `R$ ${totalPreco.toFixed(2).replace(".", ",")}`;
      tempoTotalSpan.textContent = `${totalDuracao} min`;

      btnEtapa1.disabled = agendamentoAtual.servicos.length === 0;
    }

    // Navegação entre etapas
    btnEtapa1.addEventListener("click", () => {
      if (agendamentoAtual.servicos.length === 0) return;
      etapa1Div.classList.add("hidden");
      etapa2Div.classList.remove("hidden");
      etapaTexto.textContent = "Etapa 2 de 3";
      etapaDescricao.textContent = "Data e Hora";
      progressBar.style.width = "66%";
      renderizarCalendario();
      renderizarHorarios();
    });

    btnVoltarEtapa1.addEventListener("click", () => {
      etapa2Div.classList.add("hidden");
      etapa1Div.classList.remove("hidden");
      etapaTexto.textContent = "Etapa 1 de 3";
      etapaDescricao.textContent = "Serviços";
      progressBar.style.width = "33%";
    });

    btnEtapa2.addEventListener("click", () => {
      if (!agendamentoAtual.data || !agendamentoAtual.horario) {
        alert("Por favor, selecione a data e o horário.");
        return;
      }
      if (agamentoAtual.local === "domicilio" && !validarEndereco()) {
        alert("Por favor, preencha todos os campos de endereço obrigatórios.");
        return;
      }

      etapa2Div.classList.add("hidden");
      etapa3Div.classList.remove("hidden");
      etapaTexto.textContent = "Etapa 3 de 3";
      etapaDescricao.textContent = "Confirmação e Pagamento";
      progressBar.style.width = "100%";
      preencherConfirmacao();
    });

    // Lógica de Endereço Domiciliar
    localBarbeariaRadio.addEventListener("change", () => {
      agendamentoAtual.local = "barbearia";
      enderecoDomicilioDiv.classList.add("hidden");
      validarEtapa2();
    });

    localDomicilioRadio.addEventListener("change", () => {
      agendamentoAtual.local = "domicilio";
      enderecoDomicilioDiv.classList.remove("hidden");
      validarEtapa2();
    });

    function validarEndereco() {
      if (agendamentoAtual.local === "domicilio") {
        return ruaInput.value && numeroInput.value && bairroInput.value && cidadeInput.value && estadoSelect.value;
      }
      return true;
    }

    [ruaInput, numeroInput, bairroInput, cidadeInput, estadoSelect].forEach(input => {
      input.addEventListener("input", validarEtapa2);
    });

    // Lógica de Pagamento
    pagamentoPixRadio.addEventListener("change", () => {
      agendamentoAtual.formaPagamento = "pix";
      pixInfoDiv.classList.remove("hidden");
      pixValorSpan.textContent = `R$ ${agendamentoAtual.precoTotal.toFixed(2).replace(".", ",")}`;
    });

    pagamentoLocalRadio.addEventListener("change", () => {
      agendamentoAtual.formaPagamento = "local";
      pixInfoDiv.classList.add("hidden");
    });

    // Renderizar Calendário
    function renderizarCalendario() {
      calendarDiv.innerHTML = "";
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();

      const primeiroDiaMes = new Date(anoAtual, mesAtual, 1);
      const ultimoDiaMes = new Date(anoAtual, mesAtual + 1, 0);

      // Preencher dias vazios no início
      for (let i = 0; i < primeiroDiaMes.getDay(); i++) {
        const emptyDiv = document.createElement("div");
        calendarDiv.appendChild(emptyDiv);
      }

      // Preencher dias do mês
      for (let dia = 1; dia <= ultimoDiaMes.getDate(); dia++) {
        const diaDiv = document.createElement("div");
        diaDiv.textContent = dia;
        diaDiv.classList.add("p-2", "rounded-md", "cursor-pointer", "hover:bg-gray-700");

        const dataAtual = new Date(anoAtual, mesAtual, dia);
        if (dataAtual.toDateString() === hoje.toDateString()) {
          diaDiv.classList.add("bg-white", "text-black", "font-bold");
        } else if (dataAtual < hoje) {
          diaDiv.classList.add("text-gray-600", "cursor-not-allowed");
        } else {
          diaDiv.classList.add("bg-slate-800", "text-white");
        }

        diaDiv.addEventListener("click", () => {
          if (dataAtual >= hoje) {
            document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("bg-white", "text-black"));
            diaDiv.classList.add("bg-white", "text-black");
            agendamentoAtual.data = dataAtual.toISOString().split("T")[0];
            validarEtapa2();
            renderizarHorarios();
          }
        });
        calendarDiv.appendChild(diaDiv);
      }
    }

    // Renderizar Horários Disponíveis (simplificado)
    function renderizarHorarios() {
      timeSlotsDiv.innerHTML = "";
      const horariosDisponiveis = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

      horariosDisponiveis.forEach(horario => {
        const slotDiv = document.createElement("div");
        slotDiv.textContent = horario;
        slotDiv.classList.add("p-2", "rounded-md", "cursor-pointer", "bg-slate-800", "text-white", "hover:bg-gray-700");

        slotDiv.addEventListener("click", () => {
          document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("bg-white", "text-black"));
          slotDiv.classList.add("bg-white", "text-black");
          agendamentoAtual.horario = horario;
          validarEtapa2();
        });
        timeSlotsDiv.appendChild(slotDiv);
      });
    }

    function validarEtapa2() {
      const dataHoraSelecionada = agendamentoAtual.data && agendamentoAtual.horario;
      const enderecoValido = validarEndereco();
      btnEtapa2.disabled = !(dataHoraSelecionada && enderecoValido);
    }

    // Preencher Confirmação
    function preencherConfirmacao() {
      confirmServicosSpan.textContent = agendamentoAtual.servicos.map(s => s.nome).join(", ");
      confirmDataSpan.textContent = agendamentoAtual.data ? new Date(agendamentoAtual.data).toLocaleDateString("pt-BR") : "N/A";
      confirmHorarioSpan.textContent = agendamentoAtual.horario || "N/A";
      confirmLocalSpan.textContent = agendamentoAtual.local === "barbearia" ? "Na Barbearia" : "A Domicílio";
      confirmPrecoTotalSpan.textContent = `R$ ${agendamentoAtual.precoTotal.toFixed(2).replace(".", ",")}`;
      pixValorSpan.textContent = `R$ ${agendamentoAtual.precoTotal.toFixed(2).replace(".", ",")}`;

      if (agendamentoAtual.local === "domicilio") {
        confirmEnderecoContainer.classList.remove("hidden");
        confirmEnderecoSpan.textContent = `${ruaInput.value}, ${numeroInput.value} - ${bairroInput.value}, ${cidadeInput.value} - ${estadoSelect.value}`;
        agendamentoAtual.endereco = {
          rua: ruaInput.value,
          numero: numeroInput.value,
          complemento: complementoInput.value,
          bairro: bairroInput.value,
          cidade: cidadeInput.value,
          estado: estadoSelect.value
        };
      } else {
        confirmEnderecoContainer.classList.add("hidden");
        agendamentoAtual.endereco = barbeiroMatheus.endereco; // Endereço da barbearia
      }

      // Preencher informações do cliente se já logado
      const userData = JSON.parse(localStorage.getItem("barberpro_user") || "{}");
      if (userData.id && userData.tipo === "cliente") {
        nomeClienteInput.value = userData.nome || "";
        emailClienteInput.value = userData.email || "";
        telefoneClienteInput.value = userData.telefone || "";
      }
    }

    // Confirmar Agendamento
    btnConfirmarAgendamento.addEventListener("click", () => {
      if (!nomeClienteInput.value || !emailClienteInput.value || !telefoneClienteInput.value) {
        alert("Por favor, preencha suas informações de contato.");
        return;
      }

      agendamentoAtual.cliente = {
        nome: nomeClienteInput.value,
        email: emailClienteInput.value,
        telefone: telefoneClienteInput.value,
        id: localStorage.getItem("barberpro_user_id") || `cli_${Date.now()}` // Usar ID existente ou gerar um novo
      };
      agendamentoAtual.barbeiroId = barbeiroMatheus.id;
      agendamentoAtual.barbeiro = barbeiroMatheus;

      if (window.BarberPro && window.BarberPro.AgendamentoStorage) {
        const salvo = window.BarberPro.AgendamentoStorage.add(agendamentoAtual);
        if (salvo) {
          alert("Agendamento realizado com sucesso!");
          window.location.href = "cliente-dashboard.html";
        } else {
          alert("Erro ao salvar agendamento. Tente novamente.");
        }
      } else {
        alert("Sistema de armazenamento não encontrado.");
      }
    });

    // Inicializar
    renderizarServicos();
    atualizarResumoServicos(); // Para desabilitar o botão Próximo inicialmente
  }
});


