// Classe para o Cartão de Fidelidade
export class MemberCard {
  constructor(name, email, phone, birthdate) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.birthdate = birthdate;
    this.points = 0;
    this.cardNumber = this.generateCardNumber();
    this.createdAt = new Date();
    this.validUntil = this.calculateValidDate();
  }
  
  // Métodos
  addPoints(points) {
    if (points <= 0) {
      throw new Error('O número de pontos deve ser maior que zero.');
    }
    
    this.points += points;
    return this.points;
  }
  
  usePoints(points) {
    if (points <= 0) {
      throw new Error('O número de pontos deve ser maior que zero.');
    }
    
    if (points > this.points) {
      throw new Error('Saldo de pontos insuficiente.');
    }
    
    this.points -= points;
    return this.points;
  }
  
  getCardDetails() {
    return {
      name: this.name,
      cardNumber: this.cardNumber,
      points: this.points,
      validUntil: this.validUntil
    };
  }
  
  // Métodos auxiliares privados
  generateCardNumber() {
    const prefix = '4000';
    let cardNum = prefix;
    
    for (let i = 0; i < 12; i++) {
      cardNum += Math.floor(Math.random() * 10);
    }
    
    // Formatação do número do cartão (4000 0000 0000 0000)
    return cardNum.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  
  calculateValidDate() {
    const validDate = new Date(this.createdAt);
    validDate.setFullYear(validDate.getFullYear() + 2); // Válido por 2 anos
    return validDate;
  }
} 