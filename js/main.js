// Importando módulos
import { MemberCard } from './memberCard.js';
import { formatDate, validateForm, showNotification } from './utils.js';

// Elementos DOM
const registerForm = document.getElementById('register-form');
const memberCardSection = document.getElementById('member-card');
const cardNameElement = document.getElementById('card-name');
const cardNumberElement = document.getElementById('card-number');
const pointsValueElement = document.getElementById('points-value');
const validUntilElement = document.getElementById('valid-until');
const addPointsButton = document.getElementById('add-points');
const usePointsButton = document.getElementById('use-points');
const ctaButton = document.querySelector('.cta-button');

// Estado da aplicação
let memberCard = null;

// Event listeners
document.addEventListener('DOMContentLoaded', init);
registerForm.addEventListener('submit', handleRegistration);
addPointsButton.addEventListener('click', handleAddPoints);
usePointsButton.addEventListener('click', handleUsePoints);
ctaButton.addEventListener('click', scrollToRegister);

// Inicialização
function init() {
  // Verificar se existe um cartão salvo no localStorage
  const savedCard = localStorage.getItem('memberCard');
  
  if (savedCard) {
    try {
      const cardData = JSON.parse(savedCard);
      memberCard = new MemberCard(
        cardData.name,
        cardData.email,
        cardData.phone,
        cardData.birthdate
      );
      
      memberCard.points = cardData.points;
      memberCard.cardNumber = cardData.cardNumber;
      memberCard.validUntil = new Date(cardData.validUntil);
      
      displayMemberCard();
    } catch (error) {
      console.error('Erro ao carregar cartão:', error);
      localStorage.removeItem('memberCard');
    }
  }
}

// Manipuladores de eventos
function handleRegistration(event) {
  event.preventDefault();
  
  const formData = new FormData(registerForm);
  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    birthdate: formData.get('birthdate')
  };
  
  if (validateForm(userData)) {
    memberCard = new MemberCard(
      userData.name,
      userData.email,
      userData.phone,
      userData.birthdate
    );
    
    saveCardToLocalStorage();
    displayMemberCard();
    registerForm.reset();
    showNotification('Cadastro realizado com sucesso!', 'success');
    
    // Rolar para a seção do cartão
    setTimeout(() => {
      document.getElementById('member-card').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  } else {
    showNotification('Por favor, preencha todos os campos corretamente.', 'error');
  }
}

function handleAddPoints() {
  if (!memberCard) return;
  
  const pointsToAdd = Math.floor(Math.random() * 20) + 10; // 10-30 pontos aleatórios
  memberCard.addPoints(pointsToAdd);
  
  updatePointsDisplay();
  saveCardToLocalStorage();
  
  showNotification(`${pointsToAdd} pontos adicionados com sucesso!`, 'success');
  animatePointsUpdate();
}

function handleUsePoints() {
  if (!memberCard) return;
  
  const pointsToUse = prompt('Quantos pontos deseja utilizar?');
  
  if (pointsToUse === null) return;
  
  const points = parseInt(pointsToUse);
  
  if (isNaN(points) || points <= 0) {
    showNotification('Por favor, insira um número válido de pontos.', 'error');
    return;
  }
  
  try {
    memberCard.usePoints(points);
    updatePointsDisplay();
    saveCardToLocalStorage();
    showNotification(`${points} pontos utilizados com sucesso!`, 'success');
    animatePointsUpdate();
  } catch (error) {
    showNotification(error.message, 'error');
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
    validUntil: memberCard.validUntil.toISOString()
  };
  
  localStorage.setItem('memberCard', JSON.stringify(cardData));
} 