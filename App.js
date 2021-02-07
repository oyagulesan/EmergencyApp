/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, SocialIcon } from 'react-native-elements';
import {
  SafeAreaView,
  StyleSheet,
  Linking,
  View,
  Text,
  StatusBar,
  TextInput,
  Platform,
  Animated,
  TouchableOpacity,
  Image
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import { Picker } from '@react-native-community/picker';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import AnimatedLoader from "react-native-animated-loader";
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AppIntro from './src/screens/AppIntro';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { setLocale, translations, TranslationContext } from './utils/translations';

const URL = 'https://emergency-visualizer.herokuapp.com';
// const URL = 'http://10.0.2.2:8080'; // Means localhost
const getToken = async () => {
  const resp = await axios.post(URL + '/api/authenticate',
    { username: 'admin', password: 'admin' }, null);
  return {
    'Authorization': 'Bearer ' + resp.data.id_token,
    'Content-Type': 'application/json'
  }
}

const App: () => React$Node = () => {
  const requestPermission = async () => {
    console.log('...request perm...');
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(
        (result) => {
          switch (result) {
            case RESULTS.GRANTED:
              console.log('The permission ACCESS_COARSE_LOCATION is granted');
              /*request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
                (result) => {
                  switch (result) {
                    case RESULTS.GRANTED:
                      console.log('The permission ACCESS_FINE_LOCATION is granted');
                      break;
                    default:
                      console.log('The permission ACCESS_FINE_LOCATION is denied...' + result);
                      break;
                  }
                }
              ) 
              */  
              break;
            default:
              console.log('The permission ACCESS_COARSE_LOCATION is denied...' + result);
              break;
          }
        }
      )
      .catch(err => console.log('...err', err));
    } else {
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
        switch (result) {
          case RESULTS.GRANTED:
            console.log('The permission LOCATION_WHEN_IN_USE is granted');
            /*request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
              switch (result) {
                case RESULTS.GRANTED:
                  console.log('The permission LOCATION_ALWAYS is granted');
                  break;
                default:
                  console.log('The permission LOCATION_ALWAYS is denied...' + result);
                  break;
              }
            }); */
            break;
          default:
            console.log('The permission LOCATION_WHEN_IN_USE is denied...' + result);
            break;
        }
      })
      .catch(err => console.log('...err', err));
    }    
  }
  const checkPermission = async () => {
    console.log('........' + Platform.OS);
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(
        async (result) => {
          switch (result) {
            case RESULTS.GRANTED:
              console.log('The permission ACCESS_COARSE_LOCATION is granted');
              /*check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
                (result) => {
                  switch (result) {
                    case RESULTS.GRANTED:
                      console.log('The permission ACCESS_FINE_LOCATION is granted');
                      break;
                    default:
                      requestPermission();
                      console.log('The permission ACCESS_FINE_LOCATION is denied...' + result);
                      break;
                  }
                }
              )*/
              break;
            default:
              console.log('The permission ACCESS_COARSE_LOCATION is denied...' + result);
              await requestPermission();
              break;
          }
        }
      )
    } else {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(
        async (result) => {
          switch (result) {
            case RESULTS.GRANTED:
              console.log('The permission LOCATION_WHEN_IN_USE is granted');
              /*check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(
                (result) => {
                  switch (result) {
                    case RESULTS.GRANTED:
                      console.log('The permission LOCATION_ALWAYS is granted');
                      break;
                    default:
                      requestPermission();
                      console.log('The permission LOCATION_ALWAYS is denied...' + result);
                      break;
                  }
                }
              )*/
              break;
            default:
              await requestPermission();
              console.log('The permission LOCATION_WHEN_IN_USE is denied...' + result);
              break;
          }
        }
      )
    }
  }
  const RoundButton = (props) => {
    return (
      <Button
        disabled={props.disabled}
        title={props.title}
        onPress={props.onPress}
        buttonStyle={{
          ...props.style,
          borderRadius: 30,
        }}
        icon={props.icon}
      >
        {props.children}
      </Button>
    );
  }
  const FadeInView = (props) => {
    const [anim, setAnim] = useState(new Animated.Value(0));
    const fadeAnim = useRef(anim).current  // Initial value for opacity: 0
    const [targetAnim, setTargetAnim] = useState(0);

    useEffect(() => {
      const t = setTimeout(() => { setTargetAnim(targetAnim == 0 ? 1 : 0) }, 750);
      let a1;
      let a2;
      if (targetAnim == 0) {
        a1 = Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
          }
        );
        a1.start();
      } else {
        a2 = Animated.timing(
          fadeAnim,
          {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
          }
        )
        a2.start();
      }
      return () => {
        anim.stopAnimation();
        clearTimeout(t);
      }
    }, [targetAnim])

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        {props.children}
      </Animated.View>
    );
  }
  const [lang, setLang] = useState('en');


  const getEventList = async () => {
    setLoading(true);
    console.log('...will get token');
    const headers = await getToken();
    console.log('...got token');
    try {
      const resp = await axios.get(URL + '/api/disaster-events',
        { headers },
        { timeout: 5000 })
        .catch(er => {
          setLoading(false);
          console.log('error occured', er);
          alert(er);
        });
      console.log('Get events resp', resp.data);
      return resp.data;
    } catch (err) {
      console.log('error', err);
      alert(err);
    }
    setLoading(false);
    return [];
  }
  const setEvent = (eventId) => {
    setEmergencyData({ ...emergencyData, event: emergencyData.eventList.find(event => event.id == eventId) });
    console.log('....emergency event id', emergencyData.event.id);
  }
  const setLoading = (loading) => {
    setEmergencyData({ ...emergencyData, loading });
  }
  const sendDemand = async () => {
    console.log('Send demand');
    setLoading(true);
    const headers = await getToken();
    const selectedEvent = emergencyData.event;
    let coords = null;
    Geolocation.getCurrentPosition(async (success) => {
      coords = success;
      try {
        const resp = await axios.post(URL + '/api/location-demands',
          {
            disasterEvent: selectedEvent,
            demand: emergencyData.demand,
            latitude: coords.coords.latitude,
            longitude: coords.coords.longitude
          },
          { headers });
        console.log('Add demand resp', resp.data);
        setLoading(false);
        showMessage({
          message: translations.demandSuccess,
          type: "success",
          duration: 2000,
        });
        return resp.data;
      } catch (ex) {
        setLoading(false);
        showMessage({
          message: translations.error,
          type: "warning",
          duration: 2000,
        });
      }
    }, (e) => {
      console.log('location error', e);
      setLoading(false);
      showMessage({
        message: translations.checkPerm,
        type: "warning",
        duration: 2000,
      });
      return null
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  }
  const sendSupply = async () => {
    console.log('Send supply');
    setLoading(true);
    const headers = await getToken();
    const selectedEvent = emergencyData.event;
    console.log('...selectedEvent', selectedEvent);
    let coords = null;
    Geolocation.getCurrentPosition(async (success) => {
      coords = success;
      try {
        const resp = await axios.post(URL + '/api/location-supplies',
          {
            disasterEvent: selectedEvent,
            supply: emergencyData.supply,
            latitude: coords.coords.latitude,
            longitude: coords.coords.longitude
          },
          { headers });
        console.log('Add supply resp', selectedEvent, emergencyData, resp.data);
        setLoading(false);
        showMessage({
          message: translations.supplySuccess,
          type: "success",
          duration: 2000,
        });
        return resp.data;
      } catch (ex) {
        setLoading(false);
        showMessage({
          message: translations.error,
          type: "warning",
          duration: 2000,
        });
      }
    }, (e) => {
      console.log('location error', e);
      setLoading(false);
      showMessage({
        message: translations.checkPerm,
        type: "warning",
        duration: 2000,
      });
      return null
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  }
  const sendEmergency = async () => {
    console.log('Send emergency');
    setLoading(true);
    const headers = await getToken();
    const selectedEvent = emergencyData.event;
    console.log('...selectedEvent', selectedEvent);
    let coords = null;
    Geolocation.getCurrentPosition(async (success) => {
      coords = success;
      try {
        // console.log('...resp: ', coords)
        const resp = await axios.post(URL + '/api/location-emergencies',
          {
            disasterEvent: selectedEvent,
            emergency: emergencyData.emergency,
            injured: emergencyData.injured,
            latitude: coords.coords.latitude,
            longitude: coords.coords.longitude
          },
          { headers });
        console.log('Add emergency resp', resp.data);
        setLoading(false);
        showMessage({
          message: translations.emergencySuccess,
          type: "success",
          duration: 2000,
        });
        return resp.data;
      } catch (ex) {
        setLoading(false);
        showMessage({
          message: translations.error,
          type: "warning",
          duration: 2000,
        });
      }
    }, (e) => {
      console.log('location error', e);
      setLoading(false);
      showMessage({
        message: translations.checkPerm,
        type: "warning",
        duration: 2000,
      });
      return null
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  }
  const sendTweet = async () => {
    let TwitterParameters = [];
    const { TwitterShareURL, TweetContent, TwitterViaAccount, TweetHashTag } = twitterData;
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
          //alert('Twitter Opened');
        })
        .catch(() => {
          alert(translations.error);
        });
    }, (e) => {
      console.log('location error', e);
      setLoading(false);
      showMessage({
        message: translations.checkPerm,
        type: "warning",
        duration: 2000,
      });
      return null
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  };
  const switchLang = () => {
    // console.log('....switchLang lang ', lang);
    translations.setLanguage(lang == 'tr' ? 'en' : 'tr');
    AsyncStorage.setItem('EmergencyApp.lang', lang == 'tr' ? 'en' : 'tr');
    if (lang == 'tr') {
      setTimeout(() => setLang('en'), 100)
    } else {
      setTimeout(() => setLang('tr'), 100)
    }
  };

  const [emergencyData, setEmergencyData] = useState({
    latitude: '',
    longitude: '',
    injured: 0,
    emergency: 0,
    demand: 0,
    supply: 0,
    event: null,
    eventList: [],
    token: '',
    loading: false,
  });
  const [isInit, setIsInit] = useState(true);

  const [twitterData, setTwitterData] = useState({
    TwitterShareURL: 'https://aboutreact.com',
    TweetContent: 's:%DEMAND% y:%INJURED% g:%EMERGENCY% l:%COORDINATES%',
    // s: sağlıklı y: yaralı dışarıda g: göçük altında k: posta kodu l: koordinat
    TwitterViaAccount: 'AboutReact',
    TweetHashTag: 'DepremYardimCagrisi',
  })

  const translations = useContext(TranslationContext);

  useEffect(() => {
    async function fetchEvents() {
      const eventList = await getEventList();
      setEmergencyData({ ...emergencyData, eventList, event: eventList[0] });
    }
    translations.setLanguage(lang);
    checkAsyncStorage();
    checkPermission();
    fetchEvents();
  }, [])

  const checkAsyncStorage = async () => {
    const langTmp = await AsyncStorage.getItem('EmergencyApp.lang');
    if (langTmp && langTmp != '') {
      translations.setLanguage(langTmp);
    } else {
      AsyncStorage.setItem('EmergencyApp.lang', lang);
    }
    const isInitTmp = await AsyncStorage.getItem('EmergencyApp.isInit');
    if (isInitTmp === true) {
      setIsInit(true);
    }
  }
  const onDone = () => {
    setIsInit(false);
    AsyncStorage.setItem('EmergencyApp.isInit', true);
  }
  return <>
    { isInit ? <AppIntro os = {Platform.OS} lang={lang} onDone={onDone} toggleLang={switchLang} />
    : emergencyData.loading ? <AnimatedLoader
      visible={true}
      overlayColor="rgba(255,255,255,0.75)"
      source={require("./res-29574-dot-loader-3.json")}
      animationStyle={styles.lottie}
      speed={1}
    />
      : <TranslationContext.Provider value={translations}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <FlashMessage position="top" />
            <TouchableOpacity style={{marginLeft: 300, marginTop: 5, borderWidth: 0, borderColor: 'black', height: 40}} onPress={switchLang}>
              <View style={{ marginTop: 10,
                flexDirection: 'row-reverse', flex: 1
              }} >
                <Image style={
                  lang == 'en' ?
                    { opacity: 0.3, marginRight: 10 } :
                    { opacity: 1, marginRight: 10 }}
                  source={require('./src/assets/united-kingdom-flag-icon-32.png')}
                />
                <Image style={
                  lang == 'tr' ?
                    { opacity: 0.3, marginRight: 10} :
                    { opacity: 1, marginRight: 10 }}
                  source={require('./src/assets/turkey-flag-icon-32.png')}
                />
              </View>
            </TouchableOpacity>
            <FadeInView>
              <View style={{
                  backgroundColor: '#cdf', height: 50,
                  borderRadius: 20, marginLeft: 20, marginRight: 20, marginTop: 5, padding: 5,
                  borderColor: '#cac', borderWidth: 2,                  
                }}>
                <Text style={{textAlignVertical: 'center', textAlign: 'center', color: '#f00', fontSize: 25, fontWeight: 'bold'}}>
                  {translations.title}
                </Text>
              </View>
            </FadeInView>
            <Text style={{
              marginTop: 5, fontSize: 20,
              fontWeight: 'bold', textAlign: 'center', color: 'white'
            }}>
              {translations.selectEvent}
            </Text>
            {emergencyData.eventList && emergencyData.eventList.length > 0 ?
              <View style={{ borderColor: 'white', borderRadius: 20, borderWidth: 2, margin: 10 }}>
                <Picker
                  selectedValue={emergencyData.event.id}
                  itemStyle={{ backgroundColor: "#325", borderRadius: 20, height: 100}}
                  onValueChange={(itemValue, itemIndex) => setEvent(itemValue)}
                >
                  {
                    emergencyData.eventList.map(e => <Picker.Item key={e.id}
                      label={e.disasterDate + ' ' + e.city + ' ' + e.type + ' ' + e.uniqueId}
                      color='#fff'
                      value={e.id} />)
                  }
                </Picker>
              </View>
              : null
            }
            <View style={{ marginTop: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', marginTop: 10, overflow: "visible", flexWrap: 'nowrap', borderColor: 'white', borderWidth: 0 }}>
                <View>
                  <Text style={{ color: '#fff', marginLeft: 10, width: 90 }}>{translations.emergencyTitle}</Text>
                </View>
                <View style={{ marginLeft: -90, marginRight: 10, marginTop: 30, width: 25, borderColor: 'white', borderWidth: 0 }}>
                  <View>
                    <TextInput
                      style={{ color: 'white', fontWeight: 'bold', borderColor: 'white', textAlign: 'center', width: 30, height: 40, borderWidth: 1 }}
                      keyboardType={'numeric'}
                      value={'' + emergencyData.emergency}
                      editable={false}
                    />
                  </View>
                </View>
                <View style={Platform.OS === 'ios' ? { marginLeft: 0, marginRight: 5, marginTop: 30, width: 25 } :
                  { marginLeft: 5, marginRight: 10, marginTop: 35, width: 25 }}>
                  <RoundButton title={'-'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    emergency: (emergencyData.emergency == 0 ? 0 : emergencyData.emergency - 1)
                  })}
                  />
                </View>
                <View style={Platform.OS === 'ios' ?{ marginRight: 5, marginTop: 30, width: 25 }:{ marginRight: 10, marginTop: 35, width: 25 }}>
                  <RoundButton title={'+'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    emergency: emergencyData.emergency + 1
                  })}
                  />
                </View>
                <View>
                  <Text style={Platform.OS === 'ios' ? {marginLeft: -95, marginTop: 80, color: '#fff'} :
                                                       {marginLeft: -110, marginTop: 80, color: '#fff'}}>{translations.injured}</Text>
                  <TextInput
                    style={Platform.OS === 'ios' ?
                    { color: 'white', fontWeight: 'bold', borderColor: 'white', textAlign: 'center', width: 30, marginTop: 10, height: 40, borderWidth: 1, marginLeft: -95 }
                    :{ color: 'white', fontWeight: 'bold', borderColor: 'white', textAlign: 'center', width: 30, marginTop: 10, height: 40, borderWidth: 1, marginLeft: -110 }}
                    keyboardType={'numeric'}
                    value={'' + emergencyData.injured}
                    editable={false}
                  />
                </View>
                <View style={Platform.OS === 'ios' ? { marginLeft: -60, marginRight: 5, marginTop: 105, width: 25 }:
                                                     { marginLeft: -70, marginRight: 10, marginTop: 110, width: 25 }}>
                  <RoundButton title={'-'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    injured: (emergencyData.injured == 0 ? 0 : emergencyData.injured - 1)
                  })}
                  />
                </View>
                <View style={Platform.OS === 'ios' ? { marginLeft: 0, marginTop: 105, width: 25 }:
                                                     { marginLeft: 0, marginTop: 110, width: 25 }}>
                  <RoundButton title={'+'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    injured: emergencyData.injured + 1
                  })}
                  />
                </View>
              </View>
              <View style={Platform.OS === 'ios' ?{ marginRight: 5, marginTop: 40 }:{ marginRight: 10, marginTop: 40 }}>
                <RoundButton disabled={emergencyData.emergency == 0 && emergencyData.injured == 0} style={{ width: 150 }} title={translations.sendEmergency} onPress={sendEmergency} />
              </View>
            </View>


            <View style={{ marginTop: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TextInput
                  style={Platform.OS === 'ios' ?{ color: 'white', fontWeight: 'bold', borderColor: 'white', textAlign: 'center', width: 30, marginTop: 5, height: 40, borderWidth: 1, marginLeft: 10 }
                  : { color: 'white', fontWeight: 'bold', borderColor: 'white', textAlign: 'center', width: 30, marginTop: 10, height: 40, borderWidth: 1, marginLeft: 10 }}
                  keyboardType={'numeric'}
                  value={'' + emergencyData.demand}
                  editable={false}
                />
                <View style={Platform.OS === 'ios' ?{ marginLeft: 5, marginRight: 5, marginTop: 5, width: 25 }
                :{ marginLeft: 10, marginRight: 10, marginTop: 10, width: 25 }}>
                  <RoundButton title={'-'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    demand: (emergencyData.demand == 0 ? 0 : emergencyData.demand - 1)
                  })}
                  />
                </View>
                <View style={Platform.OS === 'ios' ?{ marginRight: 5, marginTop: 5, width: 25 }
                :{ marginRight: 10, marginTop: 10, width: 25 }}>
                  <RoundButton title={'+'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    demand: emergencyData.demand + 1
                  })}
                  />
                </View>
              </View>
              <View style={Platform.OS === 'ios' ?{ marginRight: 5, marginTop: 20 }
                :{ marginRight: 10, marginTop: 20 }}>
                <RoundButton disabled={emergencyData.demand == 0} style={{ width: 150 }} title={translations.sendDemand} onPress={sendDemand} />
              </View>
            </View>

            <View style={{ marginTop: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TextInput
                  style={{ color: 'white', fontWeight: 'bold', borderColor: 'white', textAlign: 'center', width: 30, marginTop: 10, height: 40, borderWidth: 1, marginLeft: 10 }}
                  keyboardType={'decimal-pad'}
                  value={'' + emergencyData.supply}
                  editable={false}
                />
                <View style={Platform.OS === 'ios' ?{ marginLeft: 5, marginRight: 5, marginTop: 10, width: 25 }
                  :{ marginLeft: 10, marginRight: 10, marginTop: 10, width: 25 }}>
                  <RoundButton title={'-'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    supply: (emergencyData.supply == 0 ? 0 : (emergencyData.supply - 1))
                  })}
                  />
                </View>
                <View style={{ marginRight: 10, marginTop: 10, width: 25 }}>
                  <RoundButton title={'+'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    supply: emergencyData.supply + 1
                  })}
                  />
                </View>
              </View>
              <View style={{ marginRight: 10, marginTop: 10 }}>
                <RoundButton disabled={emergencyData.supply == 0} style={{ width: 150 }} title={translations.sendSupply} onPress={sendSupply} />
              </View>
            </View>
            <View style={emergencyData.supply == 0 && 
                    emergencyData.demand == 0 && emergencyData.injured == 0 && emergencyData.emergency == 0 ?
                    { marginTop: 0, marginBottom: 5, flexDirection: 'row', justifyContent: 'center', opacity: 0.3 }
                   : { marginTop: 0, marginBottom: 5, flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: 'bold' }}>{translations.sendTweet}</Text>
            </View>
            <View style={{ marginTop: 0, marginBottom: 10, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity disabled={emergencyData.supply == 0 && 
                emergencyData.demand == 0 && emergencyData.injured == 0 && emergencyData.emergency == 0} onPress={sendTweet}>
                <Image
                  style={emergencyData.supply == 0 && 
                    emergencyData.demand == 0 && emergencyData.injured == 0 && emergencyData.emergency == 0 ?
                    { width: 50, height: 50, marginTop: 0, opacity: 0.3 } : { width: 50, height: 50, marginTop: 0 }}
                  source={require('./src/assets/twitter.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TranslationContext.Provider>
    }
  </>
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#325',
    justifyContent: 'space-between',
    height: '100%',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  lottie: {
    width: 100,
    height: 100
  }
});

export default App;
