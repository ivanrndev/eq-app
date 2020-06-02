import ReactNative from 'react-native';
import I18n from 'react-native-i18n';
import AsyncStorage from '@react-native-community/async-storage';
// Import all locales
import en from './locales/en.json';
import ru from './locales/ru.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// setup language
I18n.translations = {en, ru};
const currentLocale = I18n.currentLocale();

AsyncStorage.getItem('language').then(language => {
  if (language) {
    I18n.defaultLocale = language;
    I18n.locale = language;
  } else {
    I18n.defaultLocale = currentLocale;
    I18n.locale = currentLocale;
    AsyncStorage.setItem('language', currentLocale);
  }
});

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
