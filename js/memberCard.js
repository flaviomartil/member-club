// import necessários
import { generateCardNumber } from './utils.js';
// Não podemos usar o import do node_modules pois está dando erro 404
// Vamos usar uma variável global definida pelo script no index.html

/**
 * Classe que representa o cartão de membro
 */
class MemberCard {
  /**
   * Cria uma instância do cartão de membro
   * @param {Object} memberData - Dados do membro
   */
  constructor(memberData) {
    this.memberName = memberData.name;
    this.email = memberData.email;
    this.phone = memberData.phone;
    this.birthdate = memberData.birthdate;
    this.cardNumber = memberData.cardNumber || generateCardNumber();
    this.points = memberData.points || 0;
    this.createdAt = memberData.createdAt || new Date();
    this.validUntil = memberData.validUntil || this.calculateValidUntil();
    this.qrCodeGenerated = false;
  }

  /**
   * Calcula a data de validade do cartão (1 ano a partir da criação)
   * @returns {Date} Data de validade
   */
  calculateValidUntil() {
    const validUntil = new Date(this.createdAt);
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    return validUntil;
  }

  /**
   * Adiciona pontos ao cartão
   * @param {number} points - Quantidade de pontos a adicionar
   * @returns {number} Novo saldo de pontos
   */
  addPoints(points) {
    if (points <= 0) {
      throw new Error('A quantidade de pontos deve ser maior que zero');
    }
    
    this.points += points;
    return this.points;
  }

  /**
   * Utiliza pontos do cartão
   * @param {number} points - Quantidade de pontos a utilizar
   * @returns {number} Novo saldo de pontos
   */
  usePoints(points) {
    if (points <= 0) {
      throw new Error('A quantidade de pontos deve ser maior que zero');
    }
    
    if (this.points < points) {
      throw new Error('Saldo insuficiente de pontos');
    }
    
    this.points -= points;
    return this.points;
  }

  /**
   * Verifica se o cartão é do tipo premium (mais de 1000 pontos)
   * @returns {boolean} Verdadeiro se for premium
   */
  isPremium() {
    return this.points >= 1000;
  }

  /**
   * Atualiza o DOM com os dados do cartão
   */
  updateCardDisplay() {
    const cardNameElement = document.getElementById('card-name');
    
    // Remover o atributo data-i18n para evitar que seja traduzido
    cardNameElement.removeAttribute('data-i18n');
    
    // Atualizar o texto com o nome do membro
    cardNameElement.textContent = this.memberName;
    
    document.getElementById('card-number').textContent = this.formatCardNumber();
    document.getElementById('points-value').textContent = this.points;
    document.getElementById('valid-until').textContent = this.formatDate(this.validUntil);
    
    // Atualiza o tipo do cartão (Premium ou Standard)
    const cardTypeElement = document.querySelector('.card-type');
    if (this.isPremium()) {
      cardTypeElement.textContent = 'Premium';
      document.querySelector('.card').classList.add('premium-card');
    } else {
      cardTypeElement.textContent = 'Standard';
      document.querySelector('.card').classList.remove('premium-card');
    }

    // Gera o QR Code se ainda não foi gerado
    this.generateQRCode();
  }

  /**
   * Gera um código QR com os dados do cartão
   */
  generateQRCode() {
    const qrContainer = document.getElementById('card-qr-code');
    if (!qrContainer || this.qrCodeGenerated) return;

    // Limpa qualquer conteúdo anterior
    qrContainer.innerHTML = '';
    
    try {
      // Cria os dados que serão codificados no QR Code
      const cardData = {
        name: this.memberName,
        cardNumber: this.cardNumber,
        points: this.points,
        validUntil: this.validUntil.toISOString().split('T')[0]
      };
      
      // Converte os dados para JSON e depois para string
      const qrData = JSON.stringify(cardData);
      
      // Verifica se a biblioteca qrcode-generator está disponível globalmente
      if (typeof qrcode === 'undefined') {
        console.error('Biblioteca QR Code não carregada.');
        return;
      }
      
      // Criando uma instância do QR Code (usando qrcode-generator)
      const qr = qrcode(0, 'M'); // Tipo 0, nível de correção de erro M
      qr.addData(qrData);
      qr.make();
      
      // Renderiza o QR Code como uma imagem e adiciona ao container
      const qrImage = qr.createImgTag(4); // Tamanho do píxel: 4
      qrContainer.innerHTML = qrImage;
      
      this.qrCodeGenerated = true;
      console.log('QR Code gerado com sucesso');
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  }

  /**
   * Formata o número do cartão em grupos de 4 dígitos
   * @returns {string} Número do cartão formatado
   */
  formatCardNumber() {
    return this.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  /**
   * Formata uma data no padrão brasileiro
   * @param {Date} date - Data a ser formatada
   * @returns {string} Data formatada
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  /**
   * Converte o cartão para um objeto simples para armazenamento
   * @returns {Object} Dados do cartão
   */
  toJSON() {
    return {
      memberName: this.memberName,
      email: this.email,
      phone: this.phone,
      birthdate: this.birthdate,
      cardNumber: this.cardNumber,
      points: this.points,
      createdAt: this.createdAt.toISOString(),
      validUntil: this.validUntil.toISOString()
    };
  }

  /**
   * Cria uma instância de MemberCard a partir de um objeto
   * @param {Object} data - Dados do cartão
   * @returns {MemberCard} Nova instância de MemberCard
   */
  static fromJSON(data) {
    return new MemberCard({
      name: data.memberName,
      email: data.email,
      phone: data.phone,
      birthdate: data.birthdate,
      cardNumber: data.cardNumber,
      points: data.points,
      createdAt: new Date(data.createdAt),
      validUntil: new Date(data.validUntil)
    });
  }
}

export default MemberCard; 