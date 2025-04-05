// Arquivo de testes para a classe MemberCard
const { MemberCard } = require('../js/memberCard.js');

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

describe('MemberCard', () => {
  let memberCard;
  
  beforeEach(() => {
    memberCard = new MemberCard('Teste Usuario', 'teste@email.com', '(11) 99999-9999', '1990-01-01');
  });
  
  test('deve criar um novo cartão com propriedades corretas', () => {
    expect(memberCard.name).toBe('Teste Usuario');
    expect(memberCard.email).toBe('teste@email.com');
    expect(memberCard.phone).toBe('(11) 99999-9999');
    expect(memberCard.birthdate).toBe('1990-01-01');
    expect(memberCard.points).toBe(0);
    expect(memberCard.cardNumber).toMatch(/^4000 \d{4} \d{4} \d{4}$/);
    expect(memberCard.createdAt).toBeInstanceOf(Date);
    expect(memberCard.validUntil).toBeInstanceOf(Date);
  });
  
  test('deve adicionar pontos corretamente', () => {
    const pontosIniciais = memberCard.points;
    memberCard.addPoints(50);
    expect(memberCard.points).toBe(pontosIniciais + 50);
  });
  
  test('deve lançar erro ao adicionar pontos não positivos', () => {
    expect(() => memberCard.addPoints(0)).toThrow();
    expect(() => memberCard.addPoints(-10)).toThrow();
  });
  
  test('deve utilizar pontos corretamente', () => {
    memberCard.addPoints(100);
    const pontosAntesDeUsar = memberCard.points;
    memberCard.usePoints(30);
    expect(memberCard.points).toBe(pontosAntesDeUsar - 30);
  });
  
  test('deve lançar erro ao utilizar mais pontos do que o disponível', () => {
    memberCard.addPoints(50);
    expect(() => memberCard.usePoints(60)).toThrow('Saldo de pontos insuficiente.');
  });
  
  test('deve retornar os detalhes do cartão corretamente', () => {
    const detalhes = memberCard.getCardDetails();
    expect(detalhes).toHaveProperty('name', memberCard.name);
    expect(detalhes).toHaveProperty('cardNumber', memberCard.cardNumber);
    expect(detalhes).toHaveProperty('points', memberCard.points);
    expect(detalhes).toHaveProperty('validUntil', memberCard.validUntil);
  });
  
  test('a data de validade deve ser 2 anos após a criação', () => {
    const dataAtual = new Date(memberCard.createdAt);
    const dataValidade = new Date(memberCard.validUntil);
    
    expect(dataValidade.getFullYear()).toBe(dataAtual.getFullYear() + 2);
    expect(dataValidade.getMonth()).toBe(dataAtual.getMonth());
    expect(dataValidade.getDate()).toBe(dataAtual.getDate());
  });
}); 