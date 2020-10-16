/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  StyleSheet,
  Linking,
  View,
  Text,
  Button,
  StatusBar,
  TextInput,
  Platform
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import { Picker } from '@react-native-community/picker';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import AnimatedLoader from "react-native-animated-loader";


import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const getToken = async () => {
  const resp = await axios.post('https://emergency-visualizer.herokuapp.com/api/authenticate',
    { username: 'admin', password: 'admin' }, null);
  return {
    'Authorization': 'Bearer ' + resp.data.id_token,
    'Content-Type': 'application/json'
  }
}

const App: () => React$Node = () => {
  const getEventList = async () => {
    setLoading(true);
    const headers = await getToken();
    try {
      const resp = await axios.get('https://emergency-visualizer.herokuapp.com/api/disaster-events', 
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
        const resp = await axios.post('https://emergency-visualizer.herokuapp.com/api/location-demands',
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
          message: "Demand request processed successfully",
          type: "success",
          duration: 2000,
        });
        return resp.data;
      } catch (ex) {
        setLoading(false);
        showMessage({
          message: "An error occured, please try again later",
          type: "warning",
          duration: 2000,
        });
      }
    }, (e) => {
      console.log('location error', e);
      setLoading(false);
      showMessage({
        message: "Please check location service permission and try again",
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
        const resp = await axios.post('https://emergency-visualizer.herokuapp.com/api/location-supplies',
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
          message: "Supply notification processed successfully",
          type: "success",
          duration: 2000,
        });
        return resp.data;
      } catch (ex) {
        setLoading(false);
        showMessage({
          message: "An error occured, please try again later",
          type: "warning",
          duration: 2000,
        });
      }
    }, (e) => {
      console.log('location error', e);
      setLoading(false);
      showMessage({
        message: "Please check location service permission and try again",
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
        const resp = await axios.post('https://emergency-visualizer.herokuapp.com/api/location-emergencies',
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
          message: "Emergency request processed successfully",
          type: "success",
          duration: 2000,
        });
        return resp.data;
      } catch (ex) {
        setLoading(false);
        showMessage({
          message: "An error occured, please try again later",
          type: "warning",
          duration: 2000,
        });
      }
    }, (e) => {
      console.log('location error', e);
      setLoading(false);
      showMessage({
        message: "Please check location service permission and try again",
        type: "warning",
        duration: 2000,
      });
      return null
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  }
  const sendTweet = async () => {
    let TwitterParameters = [];
    const {TwitterShareURL, TweetContent, TwitterViaAccount, TweetHashTag} = twitterData;
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
              alert('Twitter Opened');
            })
            .catch(() => {
              alert('Something went wrong');
            });
      }, (e) => {
          console.log('location error', e);
          setLoading(false);
          showMessage({
            message: "Please check location service permission and try again",
            type: "warning",
            duration: 2000,
          });
          return null
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
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
  const [twitterData, setTwitterData] = useState({
    TwitterShareURL: 'https://aboutreact.com',
    TweetContent: 's:%DEMAND% y:%INJURED% g:%EMERGENCY% l:%COORDINATES%',
    // s: sağlıklı y: yaralı dışarıda g: göçük altında k: posta kodu l: koordinat
    TwitterViaAccount: 'AboutReact',
    TweetHashTag: 'DepremYardimCagrisi',
  })
  useEffect(() => {
    async function fetchEvents() {
      const eventList = await getEventList();
      setEmergencyData({ ...emergencyData, eventList, event: eventList[0] });
    }
    fetchEvents();
  }, []);

  return <>
    { emergencyData.loading ? <AnimatedLoader
       visible={true}
       overlayColor="rgba(255,255,255,0.75)"
       source={require("./res-29574-dot-loader-3.json")}
       animationStyle={styles.lottie}
       speed={1}
     />
     : <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <FlashMessage position="top" />
          <Text style={{
            backgroundColor: '#cdf', height: 70, fontSize: 30, fontWeight: 'bold',
            textAlignVertical: 'center', textAlign: 'center', color: '#f00'
          }}>
            Emergency
            </Text>
          <Text style={{ marginTop: 50, fontSize: 20, fontWeight: 'bold', textAlign: 'left', color: 'blue' }}>
            Select Event
            </Text>
          {emergencyData.eventList && emergencyData.eventList.length > 0 ?
            <View style={{ borderColor: 'blue', borderWidth: 1, marginTop: 10, marginBottom: 10 }}>
              <Picker
                selectedValue={emergencyData.event.id}
                itemStyle={{ color: 'blue' }}
                onValueChange={(itemValue, itemIndex) => setEvent(itemValue)}
              >
                {
                  emergencyData.eventList.map(e => <Picker.Item key={e.id}
                    label={e.disasterDate + ' ' + e.city + ' ' + e.type + ' ' + e.uniqueId} value={e.id} />)
                }
              </Picker>
            </View>
            : null
          }
          <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View>
                <Text style={{marginLeft: 5}}>Emergency</Text>
                <TextInput
                  style={{ width: 30, marginTop: 10, height: 40, borderWidth: 1, marginLeft: 10 }}
                  keyboardType={'numeric'}
                  value={'' + emergencyData.emergency}
                  editable={false}
                />
              </View>
              <View style={Platform.OS === 'ios' ? { marginLeft: -40, marginRight: 10, marginTop: 30, width: 25 } :
              { marginLeft: -25, marginRight: 10, marginTop: 30, width: 25 }}>
                <Button title={'-'} onPress={() => setEmergencyData({
                  ...emergencyData,
                  emergency: (emergencyData.emergency == 0 ? 0 : emergencyData.emergency - 1)
                })}
                />
              </View>
              <View style={{ marginRight: 10, marginTop: 30, width: 25 }}>
                <Button title={'+'} onPress={() => setEmergencyData({
                  ...emergencyData,
                  emergency: emergencyData.emergency + 1
                })}
                />
              </View>
              <View>
                <Text>Injured</Text>
                <TextInput
                  style={{ width: 30, marginTop: 10, height: 40, borderWidth: 1, marginLeft: 10 }}
                  keyboardType={'numeric'}
                  value={'' + emergencyData.injured}
                  editable={false}
                />
              </View>
              <View style={{ marginLeft: 0, marginRight: 10, marginTop: 30, width: 25 }}>
                <Button title={'-'} onPress={() => setEmergencyData({
                  ...emergencyData,
                  injured: (emergencyData.injured == 0 ? 0 : emergencyData.injured - 1)
                })}
                />
              </View>
              <View style={{ marginRight: 0, marginTop: 30, width: 25 }}>
                <Button title={'+'} onPress={() => setEmergencyData({
                  ...emergencyData,
                  injured: emergencyData.injured + 1
                })}
                />
              </View>
            </View>
            <View style={{ marginRight: 5, marginTop: 40, width: 140 }}>
              <Button title={'Send Emergency'} onPress={sendEmergency} />
            </View>
          </View>


          <View style={{ marginTop: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TextInput
                style={{ width: 30, marginTop: 10, height: 40, borderWidth: 1, marginLeft: 10 }}
                keyboardType={'numeric'}
                value={'' + emergencyData.demand}
                editable={false}
              />
              <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10, width: 25 }}>
                <Button title={'-'} onPress={() => setEmergencyData({
                  ...emergencyData,
                  demand: (emergencyData.demand == 0 ? 0 : emergencyData.demand - 1)
                })}
                />
              </View>
              <View style={{ marginRight: 10, marginTop: 10, width: 25 }}>
                <Button title={'+'} onPress={() => setEmergencyData({
                  ...emergencyData,
                  demand: emergencyData.demand + 1
                })}
                />
              </View>
            </View>
            <View style={{ marginRight: 10, marginTop: 20 }}>
              <Button title={'Send Demand'} onPress={sendDemand} />
            </View>
          </View>

          <View style={{ marginTop: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TextInput
                style={{ width: 30, marginTop: 10, height: 40, borderWidth: 1, marginLeft: 10 }}
                keyboardType={'decimal-pad'}
                value={'' + emergencyData.supply}
                editable={false}
              />
              <View style={{ marginLeft: 10, marginRight: 10, marginTop: 10, width: 25 }}>
                <Button title={'-'} onPress={() => setEmergencyData({
                  ...emergencyData,
                  supply: (emergencyData.supply == 0 ? 0 : (emergencyData.supply - 1))
                })}
                />
              </View>
              <View style={{ marginRight: 10, marginTop: 10, width: 25 }}>
                <Button title={'+'} onPress={() => setEmergencyData({
                  ...emergencyData,
                  supply: emergencyData.supply + 1
                })}
                />
              </View>
            </View>
            <View style={{ marginRight: 10, marginTop: 20 }}>
              <Button title={'Send Supply'} onPress={sendSupply} />
            </View>
          </View>
          <View style={{height: 40}} />
          <View style={{ marginTop: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <Button title={'Send Tweet'} onPress={sendTweet} />
          </View>
        </View>
      </SafeAreaView>
      </>
     }
    </>
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
    justifyContent: 'space-between',
    marginTop: 20,
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
