/**
 * Classe para gerenciar o histórico de transações dos pontos do cartão fidelidade
 */
export class TransactionHistory {
  constructor(cardNumber) {
    this.cardNumber = cardNumber;
    this.transactions = this.loadTransactions();
  }

  /**
   * Adiciona uma nova transação ao histórico
   * @param {string} type - Tipo da transação ('add' ou 'use')
   * @param {number} points - Quantidade de pontos
   * @param {string} description - Descrição da transação
   */
  addTransaction(type, points, description = '') {
    const transaction = {
      id: this.generateTransactionId(),
      type,
      points,
      description,
      timestamp: new Date().toISOString(),
      cardNumber: this.cardNumber
    };

    this.transactions.push(transaction);
    this.saveTransactions();
    
    return transaction;
  }

  /**
   * Obtém todas as transações do histórico
   * @returns {Array} Lista de transações
   */
  getTransactions() {
    return this.transactions;
  }

  /**
   * Obtém as transações filtradas por tipo
   * @param {string} type - Tipo da transação ('add' ou 'use')
   * @returns {Array} Lista de transações filtradas
   */
  getTransactionsByType(type) {
    return this.transactions.filter(transaction => transaction.type === type);
  }

  /**
   * Carrega as transações do localStorage
   * @private
   * @returns {Array} Lista de transações
   */
  loadTransactions() {
    const key = `transactions_${this.cardNumber}`;
    const transactions = localStorage.getItem(key);
    
    return transactions ? JSON.parse(transactions) : [];
  }

  /**
   * Salva as transações no localStorage
   * @private
   */
  saveTransactions() {
    const key = `transactions_${this.cardNumber}`;
    localStorage.setItem(key, JSON.stringify(this.transactions));
  }

  /**
   * Gera um ID único para a transação
   * @private
   * @returns {string} ID da transação
   */
  generateTransactionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  /**
   * Formata a data de uma transação para exibição
   * @param {string} timestamp - Timestamp ISO da transação
   * @returns {string} Data formatada
   */
  static formatTransactionDate(timestamp) {
    const date = new Date(timestamp);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
} 