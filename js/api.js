/**
 * Simulação de API para operações do cartão de fidelidade
 * Este módulo simula chamadas assíncronas para um backend
 */

// Função auxiliar para simular delay de rede
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Simulação de erro randômico (1 em 10 chance)
function randomError() {
  return Math.random() < 0.1;
}

/**
 * Classe que simula uma API para o cartão de fidelidade
 */
export class MemberClubAPI {
  constructor() {
    // Simulando um token de API
    this.apiToken = 'sim_' + Math.random().toString(36).substring(2, 15);
    this.baseDelay = 800; // Delay base para simular tempo de resposta da rede
  }

  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise} Promise com os dados do usuário e cartão criado
   */
  async registerUser(userData) {
    // Simular delay de rede
    await delay(this.baseDelay + Math.random() * 500);
    
    // Simular erro
    if (randomError()) {
      throw new Error('Erro ao registrar usuário. Tente novamente.');
    }
    
    // Simular resposta do servidor
    const cardNumber = this.generateCardNumber();
    const createdAt = new Date();
    const validUntil = new Date(createdAt);
    validUntil.setFullYear(validUntil.getFullYear() + 2);
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      ...userData,
      cardNumber,
      points: 0,
      level: 'Standard',
      createdAt: createdAt.toISOString(),
      validUntil: validUntil.toISOString()
    };
  }

  /**
   * Adiciona pontos ao cartão do usuário
   * @param {string} cardNumber - Número do cartão
   * @param {number} points - Pontos a adicionar
   * @returns {Promise} Promise com o novo saldo
   */
  async addPoints(cardNumber, points) {
    if (!cardNumber || points <= 0) {
      throw new Error('Número do cartão e pontos são obrigatórios');
    }
    
    // Simular delay de rede
    await delay(this.baseDelay + Math.random() * 300);
    
    // Simular erro
    if (randomError()) {
      throw new Error('Erro ao adicionar pontos. Tente novamente.');
    }
    
    // Obter saldo atual (simula consulta ao banco de dados)
    const currentBalance = await this.getCardBalance(cardNumber);
    
    // Calcular novo saldo
    const newBalance = currentBalance + points;
    
    // Simular atualização no banco de dados
    await delay(Math.random() * 200);
    
    return {
      cardNumber,
      previousBalance: currentBalance,
      addedPoints: points,
      newBalance,
      operationId: Date.now().toString(36),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Utiliza pontos do cartão do usuário
   * @param {string} cardNumber - Número do cartão
   * @param {number} points - Pontos a utilizar
   * @returns {Promise} Promise com o novo saldo
   */
  async usePoints(cardNumber, points) {
    if (!cardNumber || points <= 0) {
      throw new Error('Número do cartão e pontos são obrigatórios');
    }
    
    // Simular delay de rede
    await delay(this.baseDelay + Math.random() * 300);
    
    // Simular erro
    if (randomError()) {
      throw new Error('Erro ao utilizar pontos. Tente novamente.');
    }
    
    // Obter saldo atual (simula consulta ao banco de dados)
    const currentBalance = await this.getCardBalance(cardNumber);
    
    // Verificar se há saldo suficiente
    if (currentBalance < points) {
      throw new Error('Saldo insuficiente para realizar esta operação');
    }
    
    // Calcular novo saldo
    const newBalance = currentBalance - points;
    
    // Simular atualização no banco de dados
    await delay(Math.random() * 200);
    
    return {
      cardNumber,
      previousBalance: currentBalance,
      usedPoints: points,
      newBalance,
      operationId: Date.now().toString(36),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Obtém o saldo atual do cartão
   * @param {string} cardNumber - Número do cartão
   * @returns {Promise} Promise com o saldo atual
   */
  async getCardBalance(cardNumber) {
    if (!cardNumber) {
      throw new Error('Número do cartão é obrigatório');
    }
    
    // Simular delay de rede
    await delay(this.baseDelay / 2 + Math.random() * 200);
    
    // Simular erro
    if (randomError()) {
      throw new Error('Erro ao verificar saldo. Tente novamente.');
    }
    
    // Simulação de busca em banco de dados
    // Neste caso, vamos obter do localStorage para manter a consistência
    try {
      const memberCardData = localStorage.getItem('memberCard');
      if (memberCardData) {
        const data = JSON.parse(memberCardData);
        if (data.cardNumber === cardNumber) {
          return data.points;
        }
      }
      
      // Se não encontrou o cartão ou o número não corresponde
      return 0;
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
      return 0;
    }
  }

  /**
   * Obtém o histórico de transações do cartão
   * @param {string} cardNumber - Número do cartão
   * @returns {Promise} Promise com o histórico de transações
   */
  async getTransactionHistory(cardNumber) {
    if (!cardNumber) {
      throw new Error('Número do cartão é obrigatório');
    }
    
    // Simular delay de rede
    await delay(this.baseDelay + Math.random() * 400);
    
    // Simular erro
    if (randomError()) {
      throw new Error('Erro ao obter histórico. Tente novamente.');
    }
    
    // Simulação de busca em banco de dados
    // Neste caso, vamos obter do localStorage para manter a consistência
    try {
      const key = `transactions_${cardNumber}`;
      const transactions = localStorage.getItem(key);
      
      return transactions ? JSON.parse(transactions) : [];
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return [];
    }
  }

  /**
   * Gera um número de cartão para simulação
   * @private
   * @returns {string} Número do cartão formatado
   */
  generateCardNumber() {
    const prefix = '4000';
    let cardNum = prefix;
    
    for (let i = 0; i < 12; i++) {
      cardNum += Math.floor(Math.random() * 10);
    }
    
    // Formatação do número do cartão (4000 0000 0000 0000)
    return cardNum.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
} 