// Script para criar dados de teste para o BarberPro
document.addEventListener("DOMContentLoaded", function() {
    // Verificar se já existem dados de teste
    const dadosExistem = localStorage.getItem("barberpro_dados_teste_criados");
    
    if (!dadosExistem) {
        console.log("Criando dados de teste para o BarberPro...");
        criarDadosTeste();
        localStorage.setItem("barberpro_dados_teste_criados", "true");
    } else {
        console.log("Dados de teste já existem.");
    }
});

// Função para criar dados de teste
function criarDadosTeste() {
    // Criar barbeiro de teste (Matheus Costa)
    const barbeiro = {
        id: "barb_matheuscosta",
        nome: "Matheus Costa",
        email: "matheus@barber.com",
        telefone: "(11) 99999-9999",
        tipo: "barbeiro",
        foto: "https://randomuser.me/api/portraits/men/32.jpg", // Pode ser substituída pela foto do Matheus
        especialidades: ["Corte Masculino", "Barba", "Degradê", "Sobrancelha"],
        avaliacao: 5.0,
        endereco: {
            rua: "Rua da Barbearia",
            numero: "123",
            complemento: "",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01000-000"
        },
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
    
    // Criar clientes de teste
    const clientes = [
        {
            id: "cli_001",
            nome: "João Cliente",
            email: "joao@cliente.com",
            telefone: "(11) 98765-1111",
            tipo: "cliente",
            foto: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        {
            id: "cli_002",
            nome: "Maria Cliente",
            email: "maria@cliente.com",
            telefone: "(11) 98765-2222",
            tipo: "cliente",
            foto: "https://randomuser.me/api/portraits/women/2.jpg"
        }
    ];
    
    // Criar agendamentos de teste para Matheus Costa
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);
    
    const formatarData = (data) => {
        return data.toISOString().split("T")[0];
    };
    
    const agendamentos = [
        {
            id: "agd_001",
            clienteId: "cli_001",
            cliente: clientes[0],
            barbeiroId: barbeiro.id,
            servicos: [
                {
                    id: "serv_corte_barba",
                    nome: "Corte + Barba",
                    preco: 80.00,
                    duracao: 70
                }
            ],
            duracaoTotal: 70,
            data: formatarData(hoje),
            horario: "10:00",
            local: "barbearia",
            endereco: barbeiro.endereco,
            formaPagamento: "pix",
            momentoPagamento: "antecipado",
            valorTotal: 80.00,
            status: "confirmado",
            dataCriacao: new Date().toISOString()
        },
        {
            id: "agd_002",
            clienteId: "cli_002",
            cliente: clientes[1],
            barbeiroId: barbeiro.id,
            servicos: [
                {
                    id: "serv_barba",
                    nome: "Barba Clássica",
                    preco: 40.00,
                    duracao: 30
                }
            ],
            duracaoTotal: 30,
            data: formatarData(amanha),
            horario: "14:30",
            local: "domicilio",
            endereco: {
                rua: "Rua do Cliente",
                numero: "456",
                complemento: "Apto 10",
                bairro: "Jardins",
                cidade: "São Paulo",
                estado: "SP",
                cep: "01400-000"
            },
            formaPagamento: "local",
            momentoPagamento: "noAtendimento",
            valorTotal: 40.00,
            status: "pendente",
            dataCriacao: new Date().toISOString()
        }
    ];
    
    // Salvar dados no localStorage
    localStorage.setItem("barberpro_usuario_logado", JSON.stringify(barbeiro));
    localStorage.setItem("barberpro_clientes", JSON.stringify(clientes));
    localStorage.setItem("barberpro_agendamentos", JSON.stringify(agendamentos));
    
    console.log("Dados de teste criados com sucesso para Matheus Costa Barber!");
}

// Função para limpar dados de teste
function limparDadosTeste() {
    localStorage.removeItem("barberpro_usuario_logado");
    localStorage.removeItem("barberpro_clientes");
    localStorage.removeItem("barberpro_agendamentos");
    localStorage.removeItem("barberpro_dados_teste_criados");
    
    console.log("Dados de teste removidos com sucesso!");
}

// Exportar funções para uso global
window.BarberPro = window.BarberPro || {};
window.BarberPro.DadosTeste = {
    criar: criarDadosTeste,
    limpar: limparDadosTeste
};


