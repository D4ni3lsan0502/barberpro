// Integração de todos os componentes do BarberPro
// Este arquivo centraliza a integração entre perfis, pagamentos, GPS e alertas

// Configurações globais
const CONFIG = {
  apiVersion: "v1",
  enableNotifications: true,
  enableGPS: true,
  enableOfflineMode: true,
  paymentGateways: ["pix", "transferencia", "cartao", "dinheiro"],
  defaultMapProvider: "openstreetmap", // alternativas: "google", "waze"
  debugMode: false
};

// Sistema de autenticação e perfis (Adaptado para Matheus Costa Barber)
const AuthSystem = {
  // Para Matheus Costa Barber, sempre consideramos ele logado como barbeiro
  getUserType: function() {
    return "barbeiro";
  },
  
  // Sempre consideramos Matheus Costa logado
  isLoggedIn: function() {
    return true;
  },
  
  // Redireciona sempre para o dashboard do barbeiro
  redirectToDashboard: function() {
    window.location.href = "barbeiro-dashboard.html";
  },
  
  // Logout apenas limpa o localStorage, mas o Matheus Costa será "logado" novamente na inicialização
  logout: function() {
    localStorage.removeItem("barberpro_user");
    localStorage.removeItem("barberpro_token");
    window.location.href = "login.html";
  }
};

// Sistema de pagamentos integrado
const PaymentSystem = {
  // Processa pagamento com base no método escolhido
  processPayment: function(method, amount, details) {
    return new Promise((resolve, reject) => {
      // Simulação de processamento de pagamento
      console.log(`Processando pagamento via ${method} no valor de R$ ${amount}`);
      
      if (!CONFIG.paymentGateways.includes(method)) {
        reject(new Error(`Método de pagamento ${method} não suportado`));
        return;
      }
      
      // Diferentes fluxos com base no método de pagamento
      switch (method) {
        case "pix":
          // Gera QR code e chave PIX (dados fixos para Matheus Costa)
          const pixData = {
            key: "matheuscosta.barber@pix",
            amount: amount,
            description: `Matheus Costa Barber - Agendamento #${Date.now()}`,
            expiresIn: 3600 // 1 hora
          };
          resolve({
            success: true,
            method: "pix",
            data: pixData,
            requiresConfirmation: true
          });
          break;
          
        case "transferencia":
          // Dados bancários para transferência (dados fixos para Matheus Costa)
          const bankData = {
            bank: "Banco do Brasil",
            agency: "1234",
            account: "12345-6",
            name: "Matheus Costa",
            document: "123.456.789-00"
          };
          resolve({
            success: true,
            method: "transferencia",
            data: bankData,
            requiresConfirmation: true
          });
          break;
          
        case "cartao":
          // Simulação de processamento de cartão
          setTimeout(() => {
            resolve({
              success: true,
              method: "cartao",
              data: {
                transactionId: `card-${Date.now()}`,
                last4: "1234"
              },
              requiresConfirmation: false
            });
          }, 1500);
          break;
          
        case "dinheiro":
          // Pagamento em dinheiro não precisa de processamento
          resolve({
            success: true,
            method: "dinheiro",
            data: {},
            requiresConfirmation: false
          });
          break;
      }
    });
  },
  
  // Verifica se o pagamento requer comprovante
  requiresReceipt: function(method) {
    return ["pix", "transferencia"].includes(method);
  },
  
  // Valida comprovante de pagamento
  validateReceipt: function(receiptData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          valid: true,
          message: "Comprovante validado com sucesso"
        });
      }, 1000);
    });
  }
};

// Sistema de GPS e localização
const LocationSystem = {
  // Obtém a localização atual do usuário
  getCurrentLocation: function() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalização não suportada pelo navegador"));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(new Error(`Erro ao obter localização: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },
  
  // Gera link para navegação GPS com base no provedor preferido
  generateNavigationLink: function(latitude, longitude, provider = CONFIG.defaultMapProvider) {
    if (!latitude || !longitude) {
      console.error("Latitude e longitude são obrigatórios");
      return null;
    }
    
    switch (provider) {
      case "google":
        return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      case "waze":
        return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
      case "apple":
        return `http://maps.apple.com/?daddr=${latitude},${longitude}`;
      case "openstreetmap":
      default:
        return `https://www.openstreetmap.org/directions?from=&to=${latitude}%2C${longitude}`;
    }
  },
  
  // Calcula distância entre duas coordenadas (em km)
  calculateDistance: function(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this._deg2rad(lat2 - lat1);
    const dLon = this._deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this._deg2rad(lat1)) * Math.cos(this._deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distância em km
    return d;
  },
  
  // Converte graus para radianos
  _deg2rad: function(deg) {
    return deg * (Math.PI/180);
  }
};

// Sistema de notificações e alertas
const NotificationSystem = {
  // Verifica se as notificações são suportadas
  isSupported: function() {
    return "Notification" in window;
  },
  
  // Solicita permissão para notificações
  requestPermission: function() {
    if (!this.isSupported()) {
      console.warn("Notificações não são suportadas neste navegador");
      return Promise.reject(new Error("Notificações não suportadas"));
    }
    
    return Notification.requestPermission();
  },
  
  // Envia notificação
  sendNotification: function(title, options = {}) {
    if (!this.isSupported()) {
      console.warn("Notificações não são suportadas neste navegador");
      return;
    }
    
    if (Notification.permission !== "granted") {
      console.warn("Permissão para notificações não concedida");
      return;
    }
    
    // Configurações padrão
    const defaultOptions = {
      icon: "/img/icons/icon-192x192.png",
      badge: "/img/icons/icon-72x72.png",
      vibrate: [100, 50, 100]
    };
    
    // Mesclar opções padrão com as fornecidas
    const notificationOptions = {...defaultOptions, ...options};
    
    // Criar e exibir notificação
    return new Notification(title, notificationOptions);
  },
  
  // Exibe alerta na interface
  showAlert: function(message, type = "info", duration = 5000) {
    // Criar elemento de alerta
    const alertElement = document.createElement("div");
    alertElement.className = `notification ${type}`;
    alertElement.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(alertElement);
    
    // Animar entrada
    setTimeout(() => {
      alertElement.classList.add("show");
    }, 10);
    
    // Configurar botão de fechar
    const closeButton = alertElement.querySelector(".notification-close");
    closeButton.addEventListener("click", () => {
      alertElement.classList.remove("show");
      setTimeout(() => {
        alertElement.remove();
      }, 300);
    });
    
    // Auto-remover após duração especificada
    if (duration > 0) {
      setTimeout(() => {
        if (document.body.contains(alertElement)) {
          alertElement.classList.remove("show");
          setTimeout(() => {
            if (document.body.contains(alertElement)) {
              alertElement.remove();
            }
          }, 300);
        }
      }, duration);
    }
    
    return alertElement;
  }
};

// Sistema de agendamentos integrado
const AppointmentSystem = {
  // Calcula duração total com base nos serviços selecionados
  calculateDuration: function(services) {
    if (!services || !Array.isArray(services) || services.length === 0) {
      return 30; // Duração padrão em minutos
    }
    
    // Duração base do primeiro serviço
    let totalDuration = services[0].duration || 30;
    
    // Adicionar 30 minutos para cada serviço adicional
    if (services.length > 1) {
      totalDuration += (services.length - 1) * 30;
    }
    
    return totalDuration;
  },
  
  // Verifica disponibilidade de horário (simulação para Matheus Costa)
  checkAvailability: function(barberId, date, time, duration) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Sempre disponível para simulação de um único barbeiro
        const isAvailable = true; 
        
        resolve({
          available: isAvailable,
          message: isAvailable ? "Horário disponível" : "Horário indisponível"
        });
      }, 500);
    });
  },
  
  // Cria um novo agendamento
  createAppointment: function(appointmentData) {
    // Em produção, isso enviaria para uma API
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointment = {
          id: `appt-${Date.now()}`,
          ...appointmentData,
          status: "pendente", // Status inicial como pendente
          createdAt: new Date().toISOString()
        };
        
        // Salvar no armazenamento local para demonstração
        // Usar o AgendamentoStorage existente
        const saved = window.BarberPro.AgendamentoStorage.add(appointment);
        
        if (saved) {
          resolve({
            success: true,
            appointment
          });
        } else {
          resolve({
            success: false,
            message: "Erro ao salvar agendamento"
          });
        }
      }, 1000);
    });
  }
};

// Sistema de favoritos (Removido para um único barbeiro)
const FavoritesSystem = {
  addFavorite: function(barberId) { return false; },
  removeFavorite: function(barberId) { return false; },
  isFavorite: function(barberId) { return false; },
  getFavorites: function() { return []; }
};

// Inicialização do aplicativo
document.addEventListener("DOMContentLoaded", function() {
  // Registrar service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
      .then(registration => {
        console.log("Service Worker registrado com sucesso:", registration.scope);
      })
      .catch(error => {
        console.error("Falha ao registrar o Service Worker:", error);
      });
  }
  
  // Para Matheus Costa Barber, sempre consideramos ele logado
  const usuarioMatheus = {
    id: "barb_matheuscosta",
    nome: "Matheus Costa",
    email: "matheus@barber.com",
    telefone: "(11) 99999-9999",
    tipo: "barbeiro",
    foto: "img/matheus_costa_barber_logo.png"
  };
  localStorage.setItem("barberpro_usuario_logado", JSON.stringify(usuarioMatheus));
  localStorage.setItem("barberpro_user", JSON.stringify(usuarioMatheus)); // Manter compatibilidade

  // Solicitar permissão para notificações
  if (CONFIG.enableNotifications && NotificationSystem.isSupported()) {
    NotificationSystem.requestPermission()
      .then(permission => {
        if (permission === "granted") {
          console.log("Permissão para notificações concedida");
        }
      })
      .catch(error => {
        console.warn("Erro ao solicitar permissão para notificações:", error);
      });
  }
});

// Exportar sistemas para uso global
window.BarberPro = window.BarberPro || {};
window.BarberPro.Auth = AuthSystem;
window.BarberPro.Payment = PaymentSystem;
window.BarberPro.Location = LocationSystem;
window.BarberPro.Notification = NotificationSystem;
window.BarberPro.Appointment = AppointmentSystem;
window.BarberPro.Favorites = FavoritesSystem; // Mantido para evitar erros, mas sem funcionalidade
window.BarberPro.Config = CONFIG;


