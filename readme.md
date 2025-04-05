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

