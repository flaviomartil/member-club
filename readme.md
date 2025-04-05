# MemberClub - Aplicação de Cartão Fidelidade Web

## 📋 Sobre o Projeto

MemberClub é uma aplicação web de cartão fidelidade desenvolvida como projeto prático do MBA de Fundamentos do Desenvolvimento Web. O projeto aplica conceitos e tecnologias modernas de desenvolvimento web, desde HTML e CSS até JavaScript avançado e TypeScript.

### 💡 Funcionalidades Principais

- Cadastro de usuários para o programa de fidelidade
- Geração de cartão fidelidade digital com número único
- Sistema de pontos com adição, uso e histórico de transações
- Diferentes níveis de benefícios baseados na quantidade de pontos
- Interface responsiva e moderna com animações e transições

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica para o conteúdo
- **CSS3**: Estilização com layouts responsivos usando Flexbox e Grid
- **JavaScript**: Funcionalidades dinâmicas e interatividade
- **TypeScript**: Tipagem estática para maior segurança do código
- **LocalStorage**: Armazenamento de dados no navegador
- **Git e GitHub**: Controle de versão e colaboração
- **Jest**: Framework para testes automatizados

## 🏗️ Estrutura do Projeto

```
member-club/
├── assets/               # Recursos como imagens e ícones
│   ├── images/
│   ├── icons/
├── css/                  # Arquivos de estilo
│   ├── styles.css        # Estilos principais
│   ├── animations.css    # Animações e transições
│   ├── responsive.css    # Media queries para responsividade
│   ├── notifications.css # Estilos para notificações
├── js/                   # Scripts JavaScript
│   ├── main.js           # Código principal
│   ├── memberCard.js     # Classe do cartão fidelidade
│   ├── utils.js          # Funções utilitárias
│   ├── api.js            # Simulação de API
│   ├── transactionHistory.js # Gerenciamento de transações
├── ts/                   # Arquivos TypeScript
│   ├── types/            # Definições de tipos
│   ├── src/              # Código-fonte TypeScript
├── tests/                # Testes automatizados
│   ├── memberCard.test.js
│   ├── transactionHistory.test.js
│   ├── api.test.js
├── index.html            # Página principal
├── package.json          # Configurações do projeto
├── tsconfig.json         # Configurações do TypeScript
├── jest.config.js        # Configuração do Jest
├── README.md             # Documentação
```

## 📸 Screenshots do Projeto

Abaixo estão algumas capturas de tela mostrando as principais funcionalidades e interfaces do MemberClub:

### 🏠 Tela Inicial

#### Tema Claro
![image](https://github.com/user-attachments/assets/328d6ea3-3d4a-473d-a9df-3043a80b6a0e)


#### Tema Escuro
![image](https://github.com/user-attachments/assets/8fbdfac8-c8e3-4d9f-a8e0-ec9b70530ed5)

*Página inicial mostrando o hero banner e os benefícios do programa de fidelidade.*

### 📝 Cadastro de Usuário

#### Tema Claro
![image](https://github.com/user-attachments/assets/07785032-7f38-442a-b575-e1a50bbceadd)


#### Tema Escuro
![image](https://github.com/user-attachments/assets/7be41789-296e-4fd8-9d73-d64dd5e97008)

*Formulário de cadastro para novos membros com campos para informações pessoais.*

### 💳 Cartão de Fidelidade

#### Tema Claro
![image](https://github.com/user-attachments/assets/19b73f16-7a06-4224-b86f-c5bf2d947d55)


#### Tema Escuro

![image](https://github.com/user-attachments/assets/1cbe1271-2e61-46c8-aab0-d6deedb434a1)


*Cartão digital de fidelidade mostrando informações do membro, saldo de pontos e QR code.*

### 📊 Histórico de Transações

#### Tema Claro
![Histórico de Transações - Tema Claro]
![image](https://github.com/user-attachments/assets/e31874aa-4370-4003-a2b1-45e0c2b1c891)

*Histórico de transações no tema claro, mostrando as adições e usos de pontos com seus detalhes.*

#### Tema Escuro
![Histórico de Transações - Tema Escuro]
![image](https://github.com/user-attachments/assets/44734118-c28a-4b28-a821-bff28d3c09bf)

*Histórico de transações no tema escuro, demonstrando o contraste e legibilidade das informações.*


## ⚙️ Como Executar o Projeto

1. **Clone o repositório**
   ```bash
   git clone git@github.com:flaviomartil/member-club.git
   cd member-club
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Compile o TypeScript**
   ```bash
   npm run tsc
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   # ou use o Live Server do VSCode
   ```

5. **Execute os testes automatizados**
   ```bash
   npm test
   ```

## 📝 Objetivos do Projeto

Este projeto implementa:

- [x] Estrutura HTML básica da página
- [x] Estilização com CSS (layout, cores, tipografia)
- [x] Layout responsivo (mobile, tablet, desktop)
- [x] Animações e transições CSS
- [x] Cadastro de usuário com validação de formulário
- [x] Funcionalidades básicas do cartão (adicionar/usar pontos)
- [x] Sistema de níveis baseados em pontos acumulados (nível Premium no cartão)
- [x] Registro e exibição do histórico de transações
- [x] Armazenamento local dos dados do usuário
- [x] Simulação de API com Promises/Async-Await
- [x] Implementação parcial do TypeScript
- [x] Testes automatizados
- [x] Adicionar ESLint e Prettier para padronização de código
- [x] Melhorar a acessibilidade da aplicação
- [x] Adicionar suporte a múltiplos idiomas
- [x] - Geração de código QR para o cartão fidelidade
- [x] Alternância entre tema claro e escuro

## 📚 Conceitos Técnicos Aplicados

- HTML Semântico
- CSS Avançado (Flexbox, Grid, Animations)
- JavaScript Moderno (ES6+)
- Programação Assíncrona (Promises, Async/Await)
- TypeScript e Tipagem Estática
- Armazenamento Local (LocalStorage)
- Gerenciamento de Estado
- Responsividade e Design Mobile-First
- Modularização de Código
- Simulação de API
- Testes Unitários com Jest

## 📄 Licença

Este projeto está sob a licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.

---

Desenvolvido como parte do MBA em Fundamentos do Desenvolvimento Web.

