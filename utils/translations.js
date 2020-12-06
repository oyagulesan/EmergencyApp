import React from 'react';
import LocalizedStrings from 'react-native-localization';
export const translations = new LocalizedStrings({
  'en': {
    title: 'EMERGENCY',
    selectEvent: 'Please select event',
    emergencyTitle: 'Emergency',
    injured: 'Injured',
    sendEmergency: 'Send Emergency',
    sendDemand: 'Send Demand',
    sendSupply: 'Send Supply',
    sendTweet: 'Send Tweet'
  },
  'tr': {
    title: 'ACİL DURUM',
    selectEvent: 'Lütfen acil durumu seçiniz',
    emergencyTitle: 'Aciliyet',
    injured: 'Yaralı',
    sendEmergency: 'Aciliyet Bildir',
    sendDemand: 'İhtiyaç Bildir',
    sendSupply: 'Erzak Bildir',
    sendTweet: 'Tweet göndermek için basınız'
  },
});

export const setLocale = (locale) => {
const prevTranslations = { ...translations.getContent() };
const newTranslations = {};
Object.keys(locale).forEach((langCode) => {
  newTranslations[langCode] = {
      ...(prevTranslations && Object.keys(prevTranslations)
        ? prevTranslations[langCode]
        : {}),
      ...locale[langCode],
    };
  });
  translations.setContent(newTranslations);
};
export const TranslationContext = React.createContext(translations);
