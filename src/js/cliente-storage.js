// Sistema de armazenamento persistente para dados de clientes
const ClienteStorage = {
  STORAGE_KEY: 'barberpro_clientes',

  getAll: function() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao recuperar clientes:', e);
      return [];
    }
  },

  getById: function(id) {
    return this.getAll().find(cliente => cliente.id === id);
  },

  getByEmail: function(email) {
    return this.getAll().find(cliente => cliente.email === email);
  },

  add: function(cliente) {
    if (!cliente || !cliente.email || !cliente.senha) return false;

    if (this.getByEmail(cliente.email)) {
      console.warn('Cliente com este email já existe.');
      return false;
    }

    if (!cliente.id) {
      cliente.id = 'cli_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    cliente.createdAt = new Date().toISOString();
    cliente.tipo = 'cliente'; // Definir tipo como cliente

    const clientes = this.getAll();
    clientes.push(cliente);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clientes));
      return true;
    } catch (e) {
      console.error('Erro ao salvar cliente:', e);
      return false;
    }
  },

  update: function(id, dadosAtualizados) {
    const clientes = this.getAll();
    const index = clientes.findIndex(cliente => cliente.id === id);

    if (index === -1) return false;

    clientes[index] = { ...clientes[index], ...dadosAtualizados, updatedAt: new Date().toISOString() };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clientes));
      return true;
    } catch (e) {
      console.error('Erro ao atualizar cliente:', e);
      return false;
    }
  },

  remove: function(id) {
    const clientes = this.getAll();
    const filtrados = clientes.filter(cliente => cliente.id !== id);

    if (filtrados.length === clientes.length) return false;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtrados));
      return true;
    } catch (e) {
      console.error('Erro ao remover cliente:', e);
      return false;
    }
  },

  clear: function() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('Erro ao limpar clientes:', e);
      return false;
    }
  }
};

window.BarberPro = window.BarberPro || {};
window.BarberPro.ClienteStorage = ClienteStorage;



// Funções de autenticação de cliente
function loginCliente(email, senha) {
  const cliente = ClienteStorage.getByEmail(email);
  if (cliente && cliente.senha === senha) {
    localStorage.setItem('cliente_logado', JSON.stringify(cliente));
    return cliente;
  }
  return null;
}

function getClienteLogado() {
  try {
    const data = localStorage.getItem('cliente_logado');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Erro ao recuperar cliente logado:', e);
    return null;
  }
}

function logout() {
  localStorage.removeItem('cliente_logado');
}

function isClienteLogado() {
  return getClienteLogado() !== null;
}

// Tornar funções globais
window.loginCliente = loginCliente;
window.getClienteLogado = getClienteLogado;
window.logout = logout;
window.isClienteLogado = isClienteLogado;

