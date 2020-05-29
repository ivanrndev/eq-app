import ReactNative from 'react-native';
import I18n from 'react-native-i18n';
// Import all locales
import en from './locales/en.json';
import ru from './locales/ru.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {en, ru};
const currentLocale = I18n.currentLocale();

// if (currentLocale === 'ru' || currentLocale === 'ru-US') {
//   I18n.defaultLocale = 'ru';
//   I18n.locale = 'ru';
// } else {
//   I18n.defaultLocale = 'en';
//   I18n.locale = 'en';
// }
I18n.defaultLocale = currentLocale;
// I18n.defaultLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL =
  currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return I18n.t(name, params);
}

export default I18n;
