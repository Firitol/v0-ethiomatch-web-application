import { createClient } from "@supabase/supabase-js";

const STORAGE_KEY = 'ethioSurveyEntries';
const ACCOUNT_STORAGE_KEY = 'ethioSurveyAccount';
const REPORT_STORAGE_KEY = 'ethioSurveyReports';
const LANGUAGE_STORAGE_KEY = 'ethioSurveyLanguage';
const deferredInstallPrompt = { event: null };

const hasDom = typeof window !== 'undefined' && typeof document !== 'undefined';

// DOM elements
const accountForm = hasDom ? document.getElementById('account-form') : null;
const userNameInput = hasDom ? document.getElementById('user-name') : null;
const userEmailInput = hasDom ? document.getElementById('user-email') : null;
const accountStatus = hasDom ? document.getElementById('account-status') : null;
const accountSummary = hasDom ? document.getElementById('account-summary') : null;

const form = hasDom ? document.getElementById('survey-form') : null;
const surveyTypeInput = hasDom ? document.getElementById('survey-type') : null;
const entityNameInput = hasDom ? document.getElementById('entity-name') : null;
const locationInput = hasDom ? document.getElementById('location') : null;
const ratingInput = hasDom ? document.getElementById('rating') : null;
const questionCountInput = hasDom ? document.getElementById('question-count') : null;
const earningPerQuestionInput = hasDom ? document.getElementById('earning-per-question') : null;
const paymentMethodInput = hasDom ? document.getElementById('payment-method') : null;
const paymentAccountInput = hasDom ? document.getElementById('payment-account') : null;
const commentInput = hasDom ? document.getElementById('comment') : null;
const questionsFileInput = hasDom ? document.getElementById('questions-file') : null;
const startTestingButton = hasDom ? document.getElementById('start-testing') : null;
const submitAnswerButton = hasDom ? document.getElementById('submit-answer') : null;
const testingAnswerInput = hasDom ? document.getElementById('testing-answer') : null;
const testingStatus = hasDom ? document.getElementById('testing-status') : null;
const testingQuestion = hasDom ? document.getElementById('testing-question') : null;
const testingHelp = hasDom ? document.getElementById('testing-help') : null;
const statusText = hasDom ? document.getElementById('form-status') : null;
const surveyList = hasDom ? document.getElementById('survey-list') : null;
const filterType = hasDom ? document.getElementById('filter-type') : null;
const clearButton = hasDom ? document.getElementById('clear-data') : null;
const summary = hasDom ? document.getElementById('summary') : null;
const reportSummary = hasDom ? document.getElementById('report-summary') : null;
const reportBody = hasDom ? document.getElementById('report-body') : null;
const installButton = hasDom ? document.getElementById('install-btn') : null;
const installStatus = hasDom ? document.getElementById('install-status') : null;
const languageSelect = hasDom ? document.getElementById('language-select') : null;

const statusEl = hasDom ? document.getElementById("auth-status") : null;
const registerForm = hasDom ? document.getElementById("register-form") : null;
const loginForm = hasDom ? document.getElementById("login-form") : null;
const tabRegister = hasDom ? document.getElementById("tab-register") : null;
const tabLogin = hasDom ? document.getElementById("tab-login") : null;
const sessionCard = hasDom ? document.getElementById("session-card") : null;
const logoutBtn = hasDom ? document.getElementById("logout-btn") : null;

let currentLanguage = 'en';
let supabase;
let testingQuestions = [];
let testingIndex = 0;
let testingScore = 0;

// --------------------
// TRANSLATIONS
// --------------------
const TRANSLATIONS = { /* same as your existing TRANSLATIONS object */ };

function t() { return TRANSLATIONS[currentLanguage] || TRANSLATIONS.en; }

function setLanguage(lang) {
  currentLanguage = TRANSLATIONS[lang] ? lang : 'en';
  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  document.documentElement.lang = currentLanguage;
  applyStaticTranslations();
  render();
}

function applyStaticTranslations() {
  if (!hasDom) return;
  const tt = t();
  document.querySelector('.lang-switch label').textContent = tt.languageLabel;
  document.querySelector('.hero p').textContent = tt.heroText;
  if (installButton) installButton.textContent = tt.installBtn;
  if (installStatus) installStatus.textContent = installStatus.textContent || tt.installTip;
  document.getElementById('account-title').textContent = tt.accountTitle;
  document.getElementById('survey-title').textContent = tt.surveyTitle;
  document.getElementById('results-title').textContent = tt.resultsTitle;
  document.getElementById('reports-title').textContent = tt.reportsTitle;
  if (clearButton) clearButton.textContent = tt.clearAll;
  document.getElementById('footer-text').textContent = tt.footerText;

  if (!testingQuestions.length && testingHelp) testingHelp.textContent = tt.testingIdle;
}

// --------------------
// LOCAL STORAGE HELPERS
// --------------------
function readEntries() { 
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } 
  catch { return []; } 
}
function writeEntries(entries) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }

function readAccount() { 
  try { return JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || null; } 
  catch { return null; } 
}
function writeAccount(account) { localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account)); }

function readReports() {
  try { return JSON.parse(localStorage.getItem(REPORT_STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function writeReports(reports) { localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reports)); }

// --------------------
// SUPABASE INIT
// --------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else if (statusEl) {
  statusEl.textContent = "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.";
}

// --------------------
// UTILITY FUNCTIONS
// --------------------
function setStatus(message, tone = "") {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = `status ${tone}`.trim();
}
function normalizeAnswer(value) { return String(value || '').trim().toLowerCase(); }
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getFilteredEntries(entries) {
  if (!filterType) return entries;
  const chosenType = filterType.value;
  if (chosenType === 'All') return entries;
  return entries.filter((entry) => entry.type === chosenType);
}

function avgRating(entries) {
  if (!entries.length) return '0.0';
  const total = entries.reduce((sum, entry) => sum + Number(entry.rating), 0);
  return (total / entries.length).toFixed(1);
}
function totalEarnings(entries) {
  return entries.reduce((sum, entry) => sum + Number(entry.totalEarning), 0);
}

// --------------------
// TESTING MODE
// --------------------
function setTestingIdle(message) {
  if (!testingQuestion || !testingStatus || !testingAnswerInput || !submitAnswerButton || !startTestingButton) return;
  testingQuestion.textContent = '';
  testingStatus.textContent = message || t().testingIdle;
  testingAnswerInput.value = '';
  testingAnswerInput.disabled = true;
  submitAnswerButton.disabled = true;
  startTestingButton.disabled = testingQuestions.length === 0;
}

function renderTestingQuestion() {
  if (!testingQuestions.length) {
    setTestingIdle(t().testingDone(testingScore, testingQuestions.length));
    return;
  }

  const current = testingQuestions[testingIndex];
  if (!current) return;

  testingQuestion.textContent = `${t().testingQuestionPrefix(testingIndex + 1, testingQuestions.length)} ${current.question}`;
  testingStatus.textContent = '';
  testingAnswerInput.value = '';
  testingAnswerInput.disabled = false;
  submitAnswerButton.disabled = false;
  testingAnswerInput.focus();
}

// --------------------
// INIT
// --------------------
if (hasDom) {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';
  if (languageSelect) languageSelect.value = storedLanguage;
  setLanguage(storedLanguage);
}
