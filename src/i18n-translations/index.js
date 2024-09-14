import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import he from './he.json';
import ar from './ar.json';
import ru from './ru.json';
import de from './de.json';
import pt from './pt.json';
import LanguageDetector from 'i18next-browser-languagedetector';

const LANGUAGES = {
    en,
    es,
    fr,
    he,
    ar,
    ru,
    de,
    pt,
}
const LANG_CODES = Object.keys(LANGUAGES);

i18n
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
            en: en,
            es : es,
            fr : fr,
            he: he,
            ar: ar,
            ru: ru,
            de: de,
            pt: pt,
          },
  });

    
  export default i18n;