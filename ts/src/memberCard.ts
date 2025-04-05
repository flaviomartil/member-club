/**
 * Interface para o cartão de fidelidade
 */
export interface IMemberCard {
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  points: number;
  cardNumber: string;
  createdAt: Date;
  validUntil: Date;
  
  addPoints(points: number): number;
  usePoints(points: number): number;
  getCardDetails(): MemberCardDetails;
}

/**
 * Interface para os detalhes do cartão
 */
export interface MemberCardDetails {
  name: string;
  cardNumber: string;
  points: number;
  validUntil: Date;
}

/**
 * Classe que representa um cartão de fidelidade
 */
export class MemberCard implements IMemberCard {
  public name: string;
  public email: string;
  public phone: string;
  public birthdate: string;
  public points: number;
  public cardNumber: string;
  public createdAt: Date;
  public validUntil: Date;
  
  /**
   * Construtor da classe MemberCard
   * @param name Nome do usuário
   * @param email Email do usuário
   * @param phone Telefone do usuário
   * @param birthdate Data de nascimento do usuário
   */
  constructor(name: string, email: string, phone: string, birthdate: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.birthdate = birthdate;
    this.points = 0;
    this.cardNumber = this.generateCardNumber();
    this.createdAt = new Date();
    this.validUntil = this.calculateValidDate();
  }
  
  /**
   * Adiciona pontos ao cartão
   * @param points Quantidade de pontos a adicionar
   * @returns Novo saldo de pontos
   */
  public addPoints(points: number): number {
    if (points <= 0) {
      throw new Error('O número de pontos deve ser maior que zero.');
    }
    
    this.points += points;
    return this.points;
  }
  
  /**
   * Utiliza pontos do cartão
   * @param points Quantidade de pontos a utilizar
   * @returns Novo saldo de pontos
   */
  public usePoints(points: number): number {
    if (points <= 0) {
      throw new Error('O número de pontos deve ser maior que zero.');
    }
    
    if (points > this.points) {
      throw new Error('Saldo de pontos insuficiente.');
    }
    
    this.points -= points;
    return this.points;
  }
  
  /**
   * Obtém os detalhes do cartão
   * @returns Detalhes do cartão
   */
  public getCardDetails(): MemberCardDetails {
    return {
      name: this.name,
      cardNumber: this.cardNumber,
      points: this.points,
      validUntil: this.validUntil
    };
  }
  
  /**
   * Gera um número de cartão aleatório
   * @returns Número de cartão formatado
   */
  private generateCardNumber(): string {
    const prefix = '4000';
    let cardNum = prefix;
    
    for (let i = 0; i < 12; i++) {
      cardNum += Math.floor(Math.random() * 10);
    }
    
    // Formatação do número do cartão (4000 0000 0000 0000)
    return cardNum.replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  
  /**
   * Calcula a data de validade do cartão
   * @returns Data de validade (2 anos após a criação)
   */
  private calculateValidDate(): Date {
    const validDate = new Date(this.createdAt);
    validDate.setFullYear(validDate.getFullYear() + 2); // Válido por 2 anos
    return validDate;
  }
} 