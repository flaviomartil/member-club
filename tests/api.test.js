// Arquivo de testes para a classe MemberClubAPI
const { MemberClubAPI } = require('../js/api.js');

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

// Mock para Math.random para tornar os testes determinísticos
const originalRandom = Math.random;
let mockRandomValue = 0.5; // Valor padrão (acima de 0.1, então não causará erros)

// Configuração do ambiente de teste
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
beforeEach(() => {
  // Restaurar o mock para o valor padrão antes de cada teste
  mockRandomValue = 0.5;
  Math.random = jest.fn(() => mockRandomValue);
});

afterAll(() => {
  // Restaurar a implementação original após todos os testes
  Math.random = originalRandom;
});

describe('MemberClubAPI', () => {
  let api;
  
  beforeEach(() => {
    api = new MemberClubAPI();
    // Reduzir o delay base para acelerar os testes
    api.baseDelay = 10;
    localStorageMock.clear();
  });
  
  test('deve registrar um usuário com sucesso', async () => {
    const userData = {
      name: 'Teste Usuario',
      email: 'teste@example.com',
      phone: '(11) 99999-9999',
      birthdate: '1990-01-01'
    };
    
    const response = await api.registerUser(userData);
    
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name', userData.name);
    expect(response).toHaveProperty('email', userData.email);
    expect(response).toHaveProperty('phone', userData.phone);
    expect(response).toHaveProperty('birthdate', userData.birthdate);
    expect(response).toHaveProperty('cardNumber');
    expect(response).toHaveProperty('points', 0);
    expect(response).toHaveProperty('level', 'Standard');
    expect(response).toHaveProperty('createdAt');
    expect(response).toHaveProperty('validUntil');
  });
  
  test('deve adicionar pontos a um cartão', async () => {
    const cardNumber = '4000 1234 5678 9012';
    const pontos = 50;
    
    // Simular um cartão no localStorage
    const cardData = {
      cardNumber,
      points: 100
    };
    localStorageMock.setItem('memberCard', JSON.stringify(cardData));
    
    const response = await api.addPoints(cardNumber, pontos);
    
    expect(response).toHaveProperty('cardNumber', cardNumber);
    expect(response).toHaveProperty('previousBalance', 100);
    expect(response).toHaveProperty('addedPoints', pontos);
    expect(response).toHaveProperty('newBalance', 150);
    expect(response).toHaveProperty('operationId');
    expect(response).toHaveProperty('timestamp');
  });
  
  test('deve utilizar pontos de um cartão', async () => {
    const cardNumber = '4000 1234 5678 9012';
    const pontos = 30;
    
    // Simular um cartão no localStorage
    const cardData = {
      cardNumber,
      points: 100
    };
    localStorageMock.setItem('memberCard', JSON.stringify(cardData));
    
    const response = await api.usePoints(cardNumber, pontos);
    
    expect(response).toHaveProperty('cardNumber', cardNumber);
    expect(response).toHaveProperty('previousBalance', 100);
    expect(response).toHaveProperty('usedPoints', pontos);
    expect(response).toHaveProperty('newBalance', 70);
  });
  
  test('deve obter o saldo de um cartão', async () => {
    const cardNumber = '4000 1234 5678 9012';
    
    // Simular um cartão no localStorage
    const cardData = {
      cardNumber,
      points: 75
    };
    localStorageMock.setItem('memberCard', JSON.stringify(cardData));
    
    const balance = await api.getCardBalance(cardNumber);
    expect(balance).toBe(75);
  });
  
  test('deve obter o histórico de transações', async () => {
    const cardNumber = '4000 1234 5678 9012';
    const transactions = [
      { id: '1', type: 'add', points: 50, description: 'Teste 1', timestamp: new Date().toISOString(), cardNumber },
      { id: '2', type: 'use', points: 20, description: 'Teste 2', timestamp: new Date().toISOString(), cardNumber }
    ];
    
    // Simular transações no localStorage
    localStorageMock.setItem(`transactions_${cardNumber}`, JSON.stringify(transactions));
    
    const history = await api.getTransactionHistory(cardNumber);
    expect(history).toHaveLength(2);
    expect(history[0].id).toBe('1');
    expect(history[1].id).toBe('2');
  });
  
  test('não deve lançar erro mesmo quando Math.random retorna um valor baixo', async () => {
    mockRandomValue = 0.05; // Valor baixo, mas não causará erro pois desabilitamos essa funcionalidade
    
    const userData = {
      name: 'Erro Teste',
      email: 'erro@example.com',
      phone: '(11) 88888-8888',
      birthdate: '1995-01-01'
    };
    
    // Verificar que não rejeita, já que desabilitamos os erros simulados
    const response = await api.registerUser(userData);
    expect(response).toHaveProperty('name', userData.name);
    expect(response).toHaveProperty('email', userData.email);
  });
}); 