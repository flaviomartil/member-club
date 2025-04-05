/**
 * theme.js - Sistema de temas para o MemberClub
 * 
 * Este módulo gerencia a alternância entre temas claro e escuro
 * e salva a preferência do usuário no armazenamento local.
 */

// Temas disponíveis
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Tema padrão
const DEFAULT_THEME = THEMES.LIGHT;

// Salva o tema atual
let currentTheme;

/**
 * Inicializa o sistema de temas
 */
function initThemeSystem() {
  // Verifica se há uma preferência salva
  currentTheme = localStorage.getItem('memberclub_theme') || DEFAULT_THEME;
  
  // Configura o tema inicial
  applyTheme(currentTheme);
  
  // Configura evento de clique no botão de alternar tema
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Adiciona listener para mudanças na preferência do sistema
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Se o tema atual é 'system', atualiza de acordo com a mudança do sistema
      if (currentTheme === THEMES.SYSTEM) {
        updateIconForTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    });
  }
}

/**
 * Alternar entre os temas disponíveis
 */
function toggleTheme() {
  // Ciclagem de temas: light -> dark -> system -> light
  switch (currentTheme) {
    case THEMES.LIGHT:
      setTheme(THEMES.DARK);
      break;
    case THEMES.DARK:
      setTheme(THEMES.SYSTEM);
      break;
    case THEMES.SYSTEM:
    default:
      setTheme(THEMES.LIGHT);
      break;
  }
}

/**
 * Define um tema específico
 * @param {string} theme - O tema a ser aplicado ('light', 'dark' ou 'system')
 */
function setTheme(theme) {
  if (!Object.values(THEMES).includes(theme)) {
    theme = DEFAULT_THEME;
  }
  
  currentTheme = theme;
  
  // Salva a preferência do usuário
  localStorage.setItem('memberclub_theme', theme);
  
  // Aplica o tema
  applyTheme(theme);
  
  // Dispara evento de mudança de tema
  document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

/**
 * Aplica o tema escolhido ao documento
 * @param {string} theme - O tema a ser aplicado
 */
function applyTheme(theme) {
  const prefersDarkScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Se o tema for 'system', usar a preferência do sistema
  if (theme === THEMES.SYSTEM) {
    document.documentElement.setAttribute('data-theme', prefersDarkScheme ? THEMES.DARK : THEMES.LIGHT);
    updateIconForTheme(prefersDarkScheme ? THEMES.DARK : THEMES.LIGHT);
  } else {
    document.documentElement.setAttribute('data-theme', theme);
    updateIconForTheme(theme);
  }
}

/**
 * Atualiza o ícone do botão de tema
 * @param {string} theme - O tema atual
 */
function updateIconForTheme(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (!themeIcon) return;
  
  // Atualiza o ícone baseado no tema
  switch (theme) {
    case THEMES.DARK:
      themeIcon.textContent = '☀️'; // Ícone do sol para o tema escuro
      break;
    case THEMES.LIGHT:
      themeIcon.textContent = '🌙'; // Ícone da lua para o tema claro
      break;
    case THEMES.SYSTEM:
      themeIcon.textContent = '⚙️'; // Ícone de engrenagem para o tema do sistema
      break;
  }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initThemeSystem);

// Exporta as funções públicas
export { setTheme, THEMES }; 