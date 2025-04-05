/**
 * Funções utilitárias para a aplicação
 */

/**
 * Formata uma data para o padrão brasileiro (DD/MM/AAAA)
 * @param {Date} date - A data a ser formatada
 * @returns {string} Data formatada
 */
export function formatDate(date) {
  if (!(date instanceof Date)) {
    return '';
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Gera um número de cartão único com 16 dígitos
 * @returns {string} Número de cartão gerado
 */
export function generateCardNumber() {
  // Prefixo do cartão
  const prefix = '8350';
  
  // Gerar 11 dígitos aleatórios
  let cardNumber = prefix;
  for (let i = 0; i < 11; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }
  
  // Adicionar dígito verificador (algoritmo de Luhn)
  let sum = 0;
  let double = false;
  
  // Loop pelos dígitos de trás para frente
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    double = !double;
  }
  
  // Calcular dígito verificador
  const checkDigit = (sum * 9) % 10;
  
  // Retornar número completo do cartão
  return cardNumber + checkDigit;
}

/**
 * Valida os dados do formulário
 * @param {Object} formData - Dados do formulário
 * @returns {boolean} Resultado da validação
 */
export function validateForm(formData) {
  // Verifica se todos os campos estão preenchidos
  for (const key in formData) {
    if (!formData[key]) {
      return false;
    }
  }
  
  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return false;
  }
  
  // Validação de telefone (formato brasileiro)
  const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;
  if (!phoneRegex.test(formData.phone)) {
    return false;
  }
  
  // Validação de data de nascimento (maior de 18 anos)
  const birthdate = new Date(formData.birthdate);
  const today = new Date();
  const age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    if (age - 1 < 18) {
      return false;
    }
  } else if (age < 18) {
    return false;
  }
  
  return true;
}

/**
 * Exibe uma notificação na tela
 * @param {string} message - Mensagem da notificação
 * @param {string} type - Tipo da notificação (success, error, warning, info)
 */
export function showNotification(message, type = 'info') {
  // Verificar se já existe um elemento de notificação
  let notification = document.querySelector('.notification');
  
  // Se não existir, criar um novo
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // Limpar classes anteriores
  notification.className = 'notification';
  notification.classList.add(`notification-${type}`);
  
  // Definir o conteúdo
  notification.textContent = message;
  
  // Mostrar a notificação
  notification.classList.add('show');
  
  // Esconder após 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
} 