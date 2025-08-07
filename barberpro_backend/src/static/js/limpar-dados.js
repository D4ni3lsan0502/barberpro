/**
 * Script para limpar dados de exemplo e perfis fake do BarberPro
 * Este script remove todos os dados simulados do localStorage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Função para limpar dados de exemplo
    function limparDadosExemplo() {
        // Lista de chaves que podem conter dados de exemplo
        const chavesParaLimpar = [
            // Dados de barbeiros de exemplo
            'barberpro_barbeiros',
            'barberpro_barbeiro_atual',
            
            // Favoritos e agendamentos simulados
            'barberpro_favoritos_cliente_',
            'barberpro_agendamentos_cliente_',
            'barberpro_agendamentos_barbeiro_',
            
            // Avaliações simuladas
            'barberpro_avaliacoes_',
            
            // Histórico de navegação
            'barberpro_recent_searches',
            'barberpro_viewed_profiles'
        ];
        
        // Limpar chaves específicas
        chavesParaLimpar.forEach(chave => {
            // Chaves exatas
            if (!chave.endsWith('_')) {
                localStorage.removeItem(chave);
            } 
            // Chaves com prefixo (busca todas as chaves que começam com o prefixo)
            else {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith(chave)) {
                        localStorage.removeItem(key);
                    }
                });
            }
        });
        
        console.log('Dados de exemplo removidos com sucesso!');
    }
    
    // Executar limpeza ao carregar a página
    limparDadosExemplo();
});
