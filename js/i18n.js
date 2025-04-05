/**
 * i18n.js - Sistema de internacionalização para o MemberClub
 * 
 * Este módulo gerencia a tradução e localização da aplicação para suporte
 * a múltiplos idiomas. Utiliza arquivos JSON para armazenamento das traduções.
 */

// Idiomas disponíveis
const AVAILABLE_LANGUAGES = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
  'es-ES': 'Español'
};

// Idioma padrão
const DEFAULT_LANGUAGE = 'pt-BR';

// Armazena as traduções carregadas
let translations = {};
let currentLanguage = localStorage.getItem('memberclub_language') || DEFAULT_LANGUAGE;

/**
 * Carrega as traduções para o idioma especificado
 * @param {string} lang - O código do idioma (ex: 'pt-BR')
 * @returns {Promise<Object>} - Objeto com as traduções
 */
async function loadTranslations(lang) {
  try {
    console.log(`Tentando carregar traduções para ${lang}`);
    // Ajustando o caminho para garantir que os arquivos de tradução sejam encontrados
    const response = await fetch(`assets/i18n/${lang}.json`);
    
    if (!response.ok) {
      console.error(`Resposta não ok ao carregar idioma ${lang}`, response.status, response.statusText);
      throw new Error(`Falha ao carregar o idioma ${lang}`);
    }
    
    const translations = await response.json();
    console.log(`Traduções carregadas com sucesso para ${lang}`, Object.keys(translations).length, 'entradas');
    return translations;
  } catch (error) {
    console.warn(`Erro ao carregar o idioma ${lang}:`, error);
    
    // Se falhar ao carregar o idioma solicitado e não for o idioma padrão,
    // tenta carregar o idioma padrão
    if (lang !== DEFAULT_LANGUAGE) {
      console.warn(`Tentando carregar o idioma padrão (${DEFAULT_LANGUAGE})`);
      return loadTranslations(DEFAULT_LANGUAGE);
    }
    
    // Se não conseguir carregar nem o idioma padrão, retorna um objeto vazio
    return {};
  }
}

/**
 * Inicializa o sistema de internacionalização
 * @returns {Promise<void>}
 */
export async function initI18n() {
  try {
    console.log('Inicializando sistema de idiomas...');
    
    // Carrega as traduções para o idioma atual
    translations = await loadTranslations(currentLanguage);
    
    // Atualiza a interface com o idioma carregado
    updateUI();
    
    // Configura o seletor de idiomas, se existir
    setupLanguageSelector();
    
    console.log(`Sistema de idiomas inicializado. Idioma atual: ${currentLanguage}`);
  } catch (error) {
    console.error('Erro ao inicializar sistema de idiomas:', error);
  }
}

/**
 * Altera o idioma da aplicação
 * @param {string} lang - O código do idioma (ex: 'pt-BR')
 * @returns {Promise<void>}
 */
export async function changeLanguage(lang) {
  if (lang === currentLanguage) return;
  
  if (!AVAILABLE_LANGUAGES[lang]) {
    console.warn(`Idioma ${lang} não disponível. Usando o idioma padrão.`);
    lang = DEFAULT_LANGUAGE;
  }
  
  // Armazena o idioma escolhido
  localStorage.setItem('memberclub_language', lang);
  currentLanguage = lang;
  
  // Carrega as traduções
  translations = await loadTranslations(lang);
  
  // Atualiza a interface
  updateUI();
  
  // Dispara evento de mudança de idioma
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

/**
 * Obtém a tradução para a chave especificada
 * @param {string} key - A chave da tradução (ex: 'home.title')
 * @param {Object} params - Parâmetros para substituir na tradução
 * @returns {string} - A tradução da chave ou a própria chave se não encontrada
 */
export function t(key, params = {}) {
  // Divide a chave em partes (ex: 'home.title' -> ['home', 'title'])
  const parts = key.split('.');
  
  // Acessa o objeto de traduções aninhado
  let value = translations;
  for (const part of parts) {
    value = value?.[part];
    if (value === undefined) break;
  }
  
  // Se não encontrou tradução, retorna a chave
  if (typeof value !== 'string') return key;
  
  // Substitui parâmetros na tradução
  return value.replace(/\{(\w+)\}/g, (_, name) => {
    return params[name] !== undefined ? params[name] : `{${name}}`;
  });
}

/**
 * Atualiza todos os elementos da interface com o idioma atual
 */
function updateUI() {
  // Atualiza elementos HTML com atributo data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  
  // Atualiza placeholders e outros atributos
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    const data = element.getAttribute('data-i18n-attr').split(',');
    
    data.forEach(item => {
      const [attr, key] = item.trim().split(':');
      element.setAttribute(attr, t(key));
    });
  });
  
  // Atualiza o atributo lang do HTML
  document.documentElement.lang = currentLanguage.split('-')[0];
}

/**
 * Configura o seletor de idiomas na interface
 */
function setupLanguageSelector() {
  const selector = document.getElementById('language-selector');
  if (!selector) {
    console.warn('Seletor de idiomas não encontrado no DOM');
    return;
  }
  
  console.log('Configurando seletor de idiomas...');
  
  // Limpa o seletor
  selector.innerHTML = '';
  
  // Adiciona as opções de idioma
  Object.entries(AVAILABLE_LANGUAGES).forEach(([code, name]) => {
    console.log(`Adicionando opção: ${code} - ${name}`);
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    option.selected = code === currentLanguage;
    selector.appendChild(option);
  });
  
  console.log(`Seletor de idiomas configurado com ${Object.keys(AVAILABLE_LANGUAGES).length} idiomas`);
  
  // Adiciona evento de mudança
  selector.addEventListener('change', (e) => {
    const selectedLanguage = e.target.value;
    console.log(`Mudando idioma para: ${selectedLanguage}`);
    changeLanguage(selectedLanguage);
  });
}

// Exportar o objeto com os idiomas disponíveis
export const languages = AVAILABLE_LANGUAGES; 