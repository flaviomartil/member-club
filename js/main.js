// Importando módulos
import MemberCard from './memberCard.js';
import { TransactionHistory } from './transactionHistory.js';
import { MemberClubAPI } from './api.js';
import { formatDate, validateForm, showNotification } from './utils.js';
import { initI18n } from './i18n.js';

// Elementos DOM
const registerForm = document.getElementById('register-form');
const memberCardSection = document.getElementById('member-card');
const transactionHistorySection = document.getElementById('transaction-history');
const cardNameElement = document.getElementById('card-name');
const cardNumberElement = document.getElementById('card-number');
const pointsValueElement = document.getElementById('points-value');
const validUntilElement = document.getElementById('valid-until');
const addPointsButton = document.getElementById('add-points');
const usePointsButton = document.getElementById('use-points');
const ctaButton = document.querySelector('.cta-button');
const transactionsBody = document.getElementById('transactions-body');
const tabButtons = document.querySelectorAll('.tab-button');
const emptyState = document.querySelector('.empty-state');

// Estado da aplicação
let memberCard = null;
let transactionHistory = null;
const api = new MemberClubAPI(); // Instância da API simulada

// Elementos visuais de loading
let loadingIndicator = null;

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Inicializando aplicação...');
  
  // Inicializar o sistema de internacionalização
  await initI18n();
  
  // Continuar com a inicialização do restante da aplicação
  createLoadingIndicator();
  
  // Registrar o manipulador de eventos para o formulário de cadastro
  if (registerForm) {
    console.log('Registrando evento de submit no formulário');
    registerForm.addEventListener('submit', handleRegistration);
  } else {
    console.error('Formulário de cadastro não encontrado');
  }
  
  // Registrar os outros eventos da página
  if (addPointsButton) addPointsButton.addEventListener('click', handleAddPoints);
  if (usePointsButton) usePointsButton.addEventListener('click', handleUsePoints);
  if (ctaButton) ctaButton.addEventListener('click', scrollToRegister);
  
  // Configurar os botões de abas para o histórico de transações
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabType = button.getAttribute('data-tab');
      
      // Ativar o botão clicado e desativar os outros
      tabButtons.forEach(btn => btn.classList.remove('active-tab'));
      button.classList.add('active-tab');
      
      // Exibir as transações do tipo selecionado
      displayTransactions(tabType);
    });
  });
  
  // Verificar se existe um cartão salvo no localStorage
  const savedCard = localStorage.getItem('memberCard');
  
  if (savedCard) {
    try {
      showLoading();
      
      const cardData = JSON.parse(savedCard);
      memberCard = new MemberCard({
        name: cardData.name,
        email: cardData.email,
        phone: cardData.phone,
        birthdate: cardData.birthdate,
        points: cardData.points,
        cardNumber: cardData.cardNumber,
        validUntil: new Date(cardData.validUntil),
        createdAt: new Date(cardData.createdAt || Date.now())
      });
      
      // Inicializar o histórico de transações
      transactionHistory = new TransactionHistory(memberCard.cardNumber);
      
      // Verificar o saldo atual via API
      try {
        const balance = await api.getCardBalance(memberCard.cardNumber);
        // Se o saldo da API for diferente do localStorage, usamos o da API
        if (balance !== memberCard.points) {
          memberCard.points = balance;
          saveCardToLocalStorage();
        }
      } catch (error) {
        console.error('Erro ao verificar saldo via API:', error);
        // Continuamos usando o saldo do localStorage
      }
      
      hideLoading();
      displayMemberCard();
      
      // Carregar histórico de transações via API
      fetchTransactionHistory();
    } catch (error) {
      hideLoading();
      console.error('Erro ao carregar cartão:', error);
      localStorage.removeItem('memberCard');
    }
  }
});

// Buscar histórico de transações via API
async function fetchTransactionHistory() {
  if (!memberCard) return;
  
  try {
    showLoading();
    const transactions = await api.getTransactionHistory(memberCard.cardNumber);
    
    // Se não encontrou transações na API, usamos as locais
    if (transactions.length === 0) {
      displayTransactions('all');
    } else {
      // Exibir as transações da API
      displayTransactionsFromApi(transactions);
    }
    
    hideLoading();
  } catch (error) {
    hideLoading();
    console.error('Erro ao obter histórico via API:', error);
    // Fallback para o histórico local
    displayTransactions('all');
  }
}

// Manipuladores de eventos
async function handleRegistration(event) {
  event.preventDefault();
  console.log('Formulário de cadastro enviado');
  
  const formData = new FormData(registerForm);
  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    birthdate: formData.get('birthdate')
  };
  
  console.log('Dados do usuário:', userData);
  
  if (validateForm(userData)) {
    try {
      showLoading();
      console.log('Enviando dados para API...');
      
      // Registrar usuário via API simulada
      const response = await api.registerUser(userData);
      console.log('Resposta da API:', response);
      
      // Criar o objeto de cartão com os dados da resposta
      memberCard = new MemberCard({
        name: response.name,
        email: response.email,
        phone: response.phone,
        birthdate: response.birthdate,
        cardNumber: response.cardNumber,
        validUntil: new Date(response.validUntil),
        createdAt: new Date()
      });
      
      // Inicializar o histórico de transações
      transactionHistory = new TransactionHistory(memberCard.cardNumber);
      
      // Adicionar uma transação inicial
      const welcomeBonus = 50; // Pontos de boas-vindas
      
      // Adicionar pontos via API
      await api.addPoints(memberCard.cardNumber, welcomeBonus);
      memberCard.addPoints(welcomeBonus);
      
      // Registrar no histórico local
      transactionHistory.addTransaction('add', welcomeBonus, 'Bônus de boas-vindas');
      
      // Salvar no localStorage
      saveCardToLocalStorage();
      
      // Atualizar interface
      hideLoading();
      displayMemberCard();
      displayTransactions('all');
      
      registerForm.reset();
      showNotification('Cadastro realizado com sucesso!', 'success');
      
      // Rolar para a seção do cartão
      setTimeout(() => {
        document.getElementById('member-card').scrollIntoView({ behavior: 'smooth' });
      }, 1000);
      
    } catch (error) {
      hideLoading();
      console.error('Erro durante o cadastro:', error);
      showNotification(error.message || 'Erro ao realizar cadastro. Tente novamente.', 'error');
    }
  } else {
    console.warn('Formulário inválido');
    showNotification('Por favor, preencha todos os campos corretamente.', 'error');
  }
}

async function handleAddPoints() {
  if (!memberCard) return;
  
  const pointsToAdd = Math.floor(Math.random() * 20) + 10; // 10-30 pontos aleatórios
  
  try {
    showLoading();
    
    // Adicionar pontos via API
    const response = await api.addPoints(memberCard.cardNumber, pointsToAdd);
    
    // Atualizar o cartão local com o novo saldo
    memberCard.points = response.newBalance;
    
    // Registrar a transação no histórico local
    transactionHistory.addTransaction('add', pointsToAdd, 'Pontos adicionados');
    
    // Atualizar interface
    updatePointsDisplay();
    displayTransactions('all');
    saveCardToLocalStorage();
    
    hideLoading();
    showNotification(`${pointsToAdd} pontos adicionados com sucesso!`, 'success');
    animatePointsUpdate();
    
  } catch (error) {
    hideLoading();
    showNotification(error.message || 'Erro ao adicionar pontos. Tente novamente.', 'error');
  }
}

async function handleUsePoints() {
  if (!memberCard) return;
  
  const pointsToUse = prompt('Quantos pontos deseja utilizar?');
  
  if (pointsToUse === null) return;
  
  const points = parseInt(pointsToUse);
  
  if (isNaN(points) || points <= 0) {
    showNotification('Por favor, insira um número válido de pontos.', 'error');
    return;
  }
  
  try {
    showLoading();
    
    // Utilizar pontos via API
    const response = await api.usePoints(memberCard.cardNumber, points);
    
    // Atualizar o cartão local com o novo saldo
    memberCard.points = response.newBalance;
    
    // Registrar a transação no histórico local
    transactionHistory.addTransaction('use', points, 'Pontos utilizados');
    
    // Atualizar interface
    updatePointsDisplay();
    displayTransactions('all');
    saveCardToLocalStorage();
    
    hideLoading();
    showNotification(`${points} pontos utilizados com sucesso!`, 'success');
    animatePointsUpdate();
    
  } catch (error) {
    hideLoading();
    showNotification(error.message || 'Erro ao utilizar pontos. Tente novamente.', 'error');
  }
}

function scrollToRegister() {
  document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
}

// Funções auxiliares
function displayMemberCard() {
  if (!memberCard) return;
  
  cardNameElement.textContent = memberCard.name;
  cardNumberElement.textContent = memberCard.cardNumber;
  pointsValueElement.textContent = memberCard.points;
  validUntilElement.textContent = formatDate(memberCard.validUntil);
  
  // Mostrar a seção do cartão
  memberCardSection.classList.remove('hidden');
  transactionHistorySection.classList.remove('hidden');
  
  // Esconder o formulário se o usuário já tiver um cartão
  document.getElementById('register').classList.add('hidden');
}

function updatePointsDisplay() {
  pointsValueElement.textContent = memberCard.points;
}

function animatePointsUpdate() {
  const pointsElement = document.querySelector('.card-points');
  pointsElement.classList.add('updated');
  
  setTimeout(() => {
    pointsElement.classList.remove('updated');
  }, 600);
}

function saveCardToLocalStorage() {
  if (!memberCard) return;
  
  const cardData = {
    name: memberCard.name,
    email: memberCard.email,
    phone: memberCard.phone,
    birthdate: memberCard.birthdate,
    points: memberCard.points,
    cardNumber: memberCard.cardNumber,
    validUntil: memberCard.validUntil.toISOString(),
    createdAt: memberCard.createdAt.toISOString()
  };
  
  localStorage.setItem('memberCard', JSON.stringify(cardData));
}

function displayTransactions(tabType) {
  if (!transactionHistory) return;
  
  // Limpar o conteúdo atual
  transactionsBody.innerHTML = '';
  
  // Obter as transações filtradas
  let transactions;
  
  if (tabType === 'all') {
    transactions = transactionHistory.getTransactions();
  } else {
    transactions = transactionHistory.getTransactionsByType(tabType);
  }
  
  // Verificar se existem transações
  if (transactions.length === 0) {
    transactionsBody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  
  // Esconder o estado vazio
  emptyState.classList.add('hidden');
  
  // Ordenar transações da mais recente para a mais antiga
  transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Mostrar as transações
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    
    // Formatar os dados
    const date = TransactionHistory.formatTransactionDate(transaction.timestamp);
    const typeText = transaction.type === 'add' ? 'Adição' : 'Utilização';
    const typeClass = transaction.type === 'add' ? 'transaction-add' : 'transaction-use';
    const points = transaction.type === 'add' ? `+${transaction.points}` : `-${transaction.points}`;
    
    // Montar a linha
    row.innerHTML = `
      <td>${date}</td>
      <td class="${typeClass}">${typeText}</td>
      <td class="${typeClass}">${points}</td>
      <td>${transaction.description}</td>
    `;
    
    transactionsBody.appendChild(row);
  });
}

// Funções para API
function displayTransactionsFromApi(transactions) {
  if (!transactions || transactions.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  
  // Esconder o estado vazio
  emptyState.classList.add('hidden');
  
  // Limpar o conteúdo atual
  transactionsBody.innerHTML = '';
  
  // Ordenar transações da mais recente para a mais antiga
  transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Mostrar as transações
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    
    // Formatar os dados
    const date = TransactionHistory.formatTransactionDate(transaction.timestamp);
    const typeText = transaction.type === 'add' ? 'Adição' : 'Utilização';
    const typeClass = transaction.type === 'add' ? 'transaction-add' : 'transaction-use';
    const points = transaction.type === 'add' ? `+${transaction.points}` : `-${transaction.points}`;
    
    // Montar a linha
    row.innerHTML = `
      <td>${date}</td>
      <td class="${typeClass}">${typeText}</td>
      <td class="${typeClass}">${points}</td>
      <td>${transaction.description}</td>
    `;
    
    transactionsBody.appendChild(row);
  });
}

// Funções para o indicador de loading
function createLoadingIndicator() {
  if (loadingIndicator) return;
  
  loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-overlay hidden';
  loadingIndicator.innerHTML = '<div class="loading"></div>';
  
  document.body.appendChild(loadingIndicator);
}

function showLoading() {
  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden');
  }
}

function hideLoading() {
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
} 