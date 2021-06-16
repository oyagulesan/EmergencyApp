import createDataContext from './createDataContext';
import axios from 'axios';
import CONFIG from '../config/config';
import AsyncStorage from '@react-native-community/async-storage';
import LocalizedStrings from 'react-native-localization';
import Geolocation from 'react-native-geolocation-service';
import { Linking } from 'react-native';


export const translations = new LocalizedStrings({
  'en': {
    done: 'DONE',
    next: 'NEXT',
    skip: 'SKIP',
    appTitle: 'EMERGENCY APP',
    title: 'EMERGENCY',
    selectEvent: 'Please select event',
    emergencyTitle: 'Emergency',
    injured: 'Injured',
    demand: 'Demand',
    supply: 'Supply',
    sendEmergency: 'Send Emergency',
    sendInjured: 'Send Injuries',
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
    done: 'TAMAM',
    next: 'SONRAKİ',
    skip: 'ATLA',
    appTitle: 'ACİL DURUM UYGULAMASI',
    title: 'ACİL DURUM',
    selectEvent: 'Lütfen acil durumu seçiniz',
    emergencyTitle: 'Aciliyet',
    injured: 'Yaralı',
    demand: 'İhtiyaç',
    supply: 'Erzak',
    sendEmergency: 'Aciliyet Bildir',
    sendInjured: 'Yaralı Bildir',
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
const appReducer = (state, action) => {
  switch (action.type) {
    case 'setLang': return { ...state, lang: action.payload };
    case 'setEventList': return { ...state, emergencyData: { ...state.emergencyData, eventList: action.payload, event: action.payload[0] }};
    case 'setHeaders': return { ...state, headers: action.payload };
    case 'setLoading': return { ...state, emergencyData: { ...state.emergencyData, loading: action.payload }};
    case 'setEvent': return { ...state, emergencyData: { ...state.emergencyData, event: state.emergencyData.eventList.find(event => event.id == action.payload) }};
    case 'setIsInit': return { ...state, isInit: action.payload };
    case 'setEmergencyData': return { ...state, emergencyData: action.payload };
    case 'resetData': return { ...state, emergencyData: { ...state.emergencyData, 
      injured: 0,
      emergency: 0,
      demand: 0,
      supply: 0,
    }}
    case 'setMsg': return { ...state, msg: action.payload };
    case 'resetMsg': return { ...state, msg: null };
    default: return state;
  }
};

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

const setMsg = dispatch => val => {
  dispatch({ type: 'setMsg', payload: val });
}

const resetMsg = dispatch => () => {
  dispatch({ type: 'resetMsg' });
}
const getToken = async () => {
    const resp = await axios.post(CONFIG.URL + '/api/authenticate',
      { username: CONFIG.USERNAME, password: CONFIG.PASSWORD }, null);
    if (resp.data && resp.data.id_token && resp.data.id_token != '') {
      return {
        'Authorization': 'Bearer ' + resp.data.id_token,
        'Content-Type': 'application/json'
      };
    }
}

const setEvent = dispatch => eventId => {
  dispatch({ type: 'setEvent', payload: eventId });
}

export const switchLang = async (lang, setLanguage) => {
    try {
    translations.setLanguage(lang == 'tr' ? 'en' : 'tr');
    AsyncStorage.setItem('EmergencyApp.lang', lang == 'tr' ? 'en' : 'tr');
    console.log('...switchLang...', lang == 'tr' ? 'en' : 'tr');
    if (lang == 'tr') {
      setTimeout(() => setLanguage('en'), 100)
    } else {
      setTimeout(() => setLanguage('tr'), 100)
    }
  } catch (ex) {
    console.log(ex);
  }
};
const setLang = dispatch => val => {
  dispatch({ type: 'setLang', payload: val});
}
const getEventList = dispatch => {
  return async (translations) => {
    dispatch({ type: 'setLoading', payload: true });
    try {
      const header = await getToken();
      if (header) {
        dispatch({ type: 'setHeaders', payload: header})
        const resp = await axios.get(CONFIG.URL + '/api/disaster-events',
          { headers: header },
          { timeout: 5000 });
        dispatch({ type: 'setEventList', payload: resp.data });
      }
      dispatch({ type: 'setLoading', payload: false });
    } catch (err) {
      console.log('error', err);
      dispatch({ type: 'setLoading', payload: false });
      dispatch({ type: 'setMsg', payload: {
        message: translations.error,
        type: "warning",
        duration: 5000,
      }});
    }
  }
}
const setIsInit = dispatch => (val) => {
  AsyncStorage.setItem('EmergencyApp.isInit', val ? 'true' : 'false');
  console.log('...setIsInit...', val ? 'true' : 'false');
  dispatch({ type: 'setIsInit', payload: val });
}

const initialize = dispatch => async () => {
  dispatch({ type: 'setLoading', payload: true });
  const langTmp = await AsyncStorage.getItem('EmergencyApp.lang');
  if (langTmp && langTmp != '') {
    translations.setLanguage(langTmp);
    dispatch({ type: 'setLang', payload: langTmp });
  }
  const isInitTmp = await AsyncStorage.getItem('EmergencyApp.isInit');
  if (isInitTmp === 'false') {
    dispatch({ type: 'setIsInit', payload: false });
  }
  // get events
  try {
    const header = await getToken();
    if (header) {
      dispatch({ type: 'setHeaders', payload: header})
      const resp = await axios.get(CONFIG.URL + '/api/disaster-events',
        { headers: header },
        { timeout: 5000 });
      dispatch({ type: 'setEventList', payload: resp.data });
    }
  } catch (err) {
    console.log('error', err);
    dispatch({ type: 'setMsg', payload: {
      message: translations.error,
      type: "warning",
      duration: 5000,
    }});
  }
  dispatch({ type: 'setLoading', payload: false });
}

const sendDemand = dispatch => async (headers, emergencyData, translations, clearData) => {
  console.log('Send demand');
  dispatch({ type: 'setLoading', payload: true });
  const selectedEvent = emergencyData.event;
  let coords = null;
  Geolocation.getCurrentPosition(async (success) => {
    coords = success;
    try {
      const resp = await axios.post(CONFIG.URL + '/api/location-demands',
        {
          disasterEvent: selectedEvent,
          demand: emergencyData.demand,
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude
        },
        { headers });
      console.log('Add demand resp', resp.data);
      clearData();
      dispatch({ type: 'setLoading', payload: false });
      dispatch({ type: 'setMsg', payload: {
        message: translations.demandSuccess,
        type: "success",
        duration: 5000,
      }});
      return resp.data;
    } catch (ex) {
      dispatch({ type: 'setLoading', payload: false });
      dispatch({ type: 'setMsg', payload: {
        message: translations.error,
        type: "warning",
        duration: 5000,
      }});
    }
  }, (e) => {
    console.log('location error', e);
    dispatch({ type: 'setLoading', payload: false });
    dispatch({ type: 'setMsg', payload: {
      message: translations.checkPerm,
      type: "warning",
      duration: 5000,
    }});
    return null
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
}
const sendSupply = dispatch => async (headers, emergencyData, translations, clearData) => {
  console.log('Send supply');
  dispatch({ type: 'setLoading', payload: true });
  const selectedEvent = emergencyData.event;
  console.log('...selectedEvent', selectedEvent);
  let coords = null;
  Geolocation.getCurrentPosition(async (success) => {
    coords = success;
    try {
      const resp = await axios.post(CONFIG.URL + '/api/location-supplies',
        {
          disasterEvent: selectedEvent,
          supply: emergencyData.supply,
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude
        },
        { headers });
      console.log('Add supply resp', selectedEvent, emergencyData, resp.data);
      clearData();
      dispatch({ type: 'setLoading', payload: false });
      dispatch({ type: 'setMsg', payload: {
        message: translations.supplySuccess,
        type: "success",
        duration: 5000,
      }});
      return resp.data;
    } catch (ex) {
      dispatch({ type: 'setLoading', payload: false });
      dispatch({ type: 'setMsg', payload: {
        message: translations.error,
        type: "warning",
        duration: 5000,
      }});
    }
  }, (e) => {
    console.log('location error', e);
    dispatch({ type: 'setLoading', payload: false });
    dispatch({ type: 'setMsg', payload: {
      message: translations.checkPerm,
      type: "warning",
      duration: 5000,
    }});
    return null
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
}
const sendEmergency = dispatch => async (headers, emergencyData, translations, clearData) => {
  console.log('Send emergency');
  dispatch({ type: 'setLoading', payload: true });
  const selectedEvent = emergencyData.event;
  console.log('...selectedEvent', selectedEvent);
  let coords = null;
  Geolocation.getCurrentPosition(async (success) => {
    coords = success;
    try {
      // console.log('...resp: ', coords)
      const resp = await axios.post(CONFIG.URL + '/api/location-emergencies',
        {
          disasterEvent: selectedEvent,
          emergency: emergencyData.emergency,
          injured: emergencyData.injured,
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude
        },
        { headers });
      console.log('Add emergency resp', resp.data);
      clearData();
      dispatch({ type: 'setLoading', payload: false });
      dispatch({ type: 'setMsg', payload: {
        message: translations.emergencySuccess,
        type: "success",
        duration: 5000,
      }});
      return resp.data;
    } catch (ex) {
      dispatch({ type: 'setLoading', payload: false });
      dispatch({ type: 'setMsg', payload: {
        message: translations.error,
        type: "warning",
        duration: 5000,
      }});
    }
  }, (e) => {
    console.log('location error', e);
    dispatch({ type: 'setLoading', payload: false });
    dispatch({ type: 'setMsg', payload: {
      message: translations.checkPerm,
      type: "warning",
      duration: 5000,
    }});
    return null
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
}
const sendTweet = dispatch => async (emergencyData, translations, clearData) => {
  dispatch({ type: 'setLoading', payload: true });
  let TwitterParameters = [];
  const { TwitterShareURL, TweetContent, TwitterViaAccount, TweetHashTag } = CONFIG.TWITTER_DATA;
  // if (TwitterShareURL)
  //  TwitterParameters.push('url=' + encodeURI(TwitterShareURL));
  if (TweetContent)
    var txt = TweetContent.replace('%DEMAND%', emergencyData.demand)
      .replace('%SUPPLY%', emergencyData.supply)
      .replace('%EMERGENCY%', emergencyData.emergency)
      .replace('%INJURED%', emergencyData.injured);
  await Geolocation.getCurrentPosition(async (success) => {
    const coords = success;
    txt = txt.replace('%COORDINATES%', (coords.coords.latitude + ' ' + coords.coords.longitude));
    TwitterParameters.push('text=' + encodeURI(txt))
    TwitterParameters.push('hashtags=' + [TweetHashTag].join(','));
    //if (TwitterViaAccount)
    //  TwitterParameters.push('via=' + encodeURI(TwitterViaAccount));
    const url = 'https://twitter.com/intent/tweet?' + TwitterParameters.join('&');
    Linking.openURL(url)
      .then(data => {
        clearData();
        dispatch({ type: 'setLoading', payload: false });
      })
      .catch(() => {
        dispatch({ type: 'setLoading', payload: false });
        dispatch({ type: 'setMsg', payload: {
          message: translations.error,
          type: "warning",
          duration: 5000,
        }});
      });
  }, (e) => {
    console.log('location error', e);
    dispatch({ type: 'setLoading', payload: false });
    dispatch({ type: 'setMsg', payload: {
      message: translations.checkPerm,
      type: "warning",
      duration: 5000,
    }});
    return null
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
};

const setEmergencyData = dispatch => val => {
  dispatch({ type: 'setEmergencyData', payload: val});
}

const resetData = dispatch => () => {
  dispatch({ type: 'resetData' });
}
export const { Provider, Context } = createDataContext(
  appReducer,
  { initialize, setIsInit, getEventList, setLang, setEvent, setEmergencyData, resetData, setMsg, resetMsg,
    sendDemand, sendSupply, sendEmergency, sendTweet},
  {
    translations,
    token: null,
    locationPermissionGranted: false,
    lang: 'en',
    emergencyData: {
      latitude: '',
      longitude: '',
      injured: 0,
      emergency: 0,
      demand: 0,
      supply: 0,
      event: null,
      eventList: [],
      headers: null,
      loading: false,
    },
    isInit: true,
    headers: '',
    msg: null
  }
);