/*import React from 'react';
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
    sendTweetText: 'Send Tweet',
    demandSuccess: 'Demand request processed successfully',
    supplySuccess: 'Supply notification processed successfully',
    emergencySuccess: 'Emergency request processed successfully',
    error: 'An error occured, please try again later',
    checkPerm: 'Please check location service permission and try again'
  },
  'tr': {
    title: 'ACİL DURUM',
    selectEvent: 'Lütfen acil durumu seçiniz',
    emergencyTitle: 'Aciliyet',
    injured: 'Yaralı',
    sendEmergency: 'Aciliyet Bildir',
    sendDemand: 'İhtiyaç Bildir',
    sendSupply: 'Erzak Bildir',
    sendTweetText: 'Tweet göndermek için basınız',
    demandSuccess: 'İşlem başarıyla gerçekleştirildi',
    supplySuccess: 'İşlem başarıyla gerçekleştirildi',
    emergencySuccess: 'İşlem başarıyla gerçekleştirildi',
    error: 'Bir hata oluştu, tekrar deneyin',
    checkPerm: 'Lokasyon servis iznini kontrol edin'
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
*/