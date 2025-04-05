// Arquivo de testes para a classe TransactionHistory
const { TransactionHistory } = require('../js/transactionHistory.js');

// Mock para localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Configuração do ambiente de teste
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('TransactionHistory', () => {
  let transactionHistory;
  const cardNumber = '4000 1234 5678 9012';
  
  beforeEach(() => {
    // Limpar o localStorage antes de cada teste
    localStorageMock.clear();
    transactionHistory = new TransactionHistory(cardNumber);
  });
  
  test('deve criar uma nova instância corretamente', () => {
    expect(transactionHistory.getTransactions()).toEqual([]);
    expect(transactionHistory.cardNumber).toBe(cardNumber);
  });
  
  test('deve adicionar uma transação de adição de pontos', () => {
    const transacao = transactionHistory.addTransaction('add', 50, 'Adição de pontos de teste');
    
    expect(transacao).toHaveProperty('id');
    expect(transacao).toHaveProperty('type', 'add');
    expect(transacao).toHaveProperty('points', 50);
    expect(transacao).toHaveProperty('description', 'Adição de pontos de teste');
    expect(transacao).toHaveProperty('timestamp');
    expect(transacao).toHaveProperty('cardNumber', cardNumber);
    
    const transacoes = transactionHistory.getTransactions();
    expect(transacoes).toHaveLength(1);
    expect(transacoes[0]).toEqual(transacao);
  });
  
  test('deve adicionar uma transação de uso de pontos', () => {
    const transacao = transactionHistory.addTransaction('use', 30, 'Uso de pontos de teste');
    
    expect(transacao).toHaveProperty('type', 'use');
    expect(transacao).toHaveProperty('points', 30);
    
    const transacoes = transactionHistory.getTransactions();
    expect(transacoes).toHaveLength(1);
  });
  
  test('deve filtrar transações por tipo', () => {
    transactionHistory.addTransaction('add', 50, 'Adição 1');
    transactionHistory.addTransaction('add', 30, 'Adição 2');
    transactionHistory.addTransaction('use', 20, 'Uso 1');
    transactionHistory.addTransaction('use', 10, 'Uso 2');
    
    const adicoes = transactionHistory.getTransactionsByType('add');
    expect(adicoes).toHaveLength(2);
    expect(adicoes[0].type).toBe('add');
    expect(adicoes[1].type).toBe('add');
    
    const usos = transactionHistory.getTransactionsByType('use');
    expect(usos).toHaveLength(2);
    expect(usos[0].type).toBe('use');
    expect(usos[1].type).toBe('use');
  });
  
  test('deve salvar transações no localStorage', () => {
    transactionHistory.addTransaction('add', 50, 'Teste localStorage');
    
    // Verificar se o método setItem do localStorage foi chamado
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    // Criar uma nova instância para verificar se carrega do localStorage
    const novaInstancia = new TransactionHistory(cardNumber);
    const transacoes = novaInstancia.getTransactions();
    
    expect(transacoes).toHaveLength(1);
    expect(transacoes[0].points).toBe(50);
    expect(transacoes[0].description).toBe('Teste localStorage');
  });
  
  test('deve formatar a data corretamente', () => {
    const timestamp = '2023-05-20T15:30:45.123Z';
    const dataFormatada = TransactionHistory.formatTransactionDate(timestamp);
    
    // Ajuste para o fuso horário local (pode variar dependendo da configuração do ambiente)
    expect(dataFormatada).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/);
  });
}); 