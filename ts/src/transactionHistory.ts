/**
 * Interface para uma transação
 */
export interface Transaction {
  id: string;
  type: 'add' | 'use';
  points: number;
  description: string;
  timestamp: string;
  cardNumber: string;
}

/**
 * Classe para gerenciar o histórico de transações dos pontos do cartão fidelidade
 */
export class TransactionHistory {
  private cardNumber: string;
  private transactions: Transaction[];

  /**
   * Construtor da classe TransactionHistory
   * @param cardNumber Número do cartão associado ao histórico
   */
  constructor(cardNumber: string) {
    this.cardNumber = cardNumber;
    this.transactions = this.loadTransactions();
  }

  /**
   * Adiciona uma nova transação ao histórico
   * @param type Tipo da transação ('add' ou 'use')
   * @param points Quantidade de pontos
   * @param description Descrição da transação
   * @returns A transação criada
   */
  public addTransaction(type: 'add' | 'use', points: number, description: string = ''): Transaction {
    const transaction: Transaction = {
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
   * @returns Lista de transações
   */
  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  /**
   * Obtém as transações filtradas por tipo
   * @param type Tipo da transação ('add' ou 'use')
   * @returns Lista de transações filtradas
   */
  public getTransactionsByType(type: 'add' | 'use'): Transaction[] {
    return this.transactions.filter(transaction => transaction.type === type);
  }

  /**
   * Carrega as transações do localStorage
   * @private
   * @returns Lista de transações
   */
  private loadTransactions(): Transaction[] {
    const key = `transactions_${this.cardNumber}`;
    const transactions = localStorage.getItem(key);
    
    return transactions ? JSON.parse(transactions) : [];
  }

  /**
   * Salva as transações no localStorage
   * @private
   */
  private saveTransactions(): void {
    const key = `transactions_${this.cardNumber}`;
    localStorage.setItem(key, JSON.stringify(this.transactions));
  }

  /**
   * Gera um ID único para a transação
   * @private
   * @returns ID da transação
   */
  private generateTransactionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  /**
   * Formata a data de uma transação para exibição
   * @param timestamp Timestamp ISO da transação
   * @returns Data formatada
   */
  public static formatTransactionDate(timestamp: string): string {
    const date = new Date(timestamp);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
} 