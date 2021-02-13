import React, { useContext, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    StatusBar,
    Image,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { switchLang, Context as AppContext } from '../context/AppContext';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONFIG from '../config/config';
import axios from 'axios';

const MapComponent = () => {
    const { state: { translations, lang, emergencyData, headers, msg }, setLang, setMsg, resetMsg } = useContext(AppContext);
  
    const [ showDemands, setShowDemands ] = useState(false);
    const [ showSupplies, setShowSupplies ] = useState(false);
    const [ showEmergencies, setShowEmergencies ] = useState(false);
    const [ showInjuries, setShowInjuries ] = useState(false);
    const [ showFacilities, setShowFacilities ] = useState(false);

    
    const [ userLoc, setUserLoc ] = useState(null);

    const [ closestFac, setClosestFac ] = useState(null);
    const [ facilities, setFacilities ] = useState(null);
    const [ demands, setDemands ] = useState(null);
    const [ supplies, setSupplies ] = useState(null);
    const [ emergencies, setEmergencies ] = useState(null);
    const [ injuries, setInjuries ] = useState(null);

    const GOOGLE_MAPS_APIKEY = 'AIzaSyD5pdtn6hxjLQndPMyDbC0Kl3KeItm54cI';
    const toRad = (x) => {
        return x * Math.PI / 180;
      }

    const haversineDistance = (coords1, coords2) => {    
        const lon1 = parseFloat(coords1.longitude);
        const lat1 = parseFloat(coords1.latitude);
      
        const lon2 = parseFloat(coords2.longitude);
        const lat2 = parseFloat(coords2.latitude);
      
        const R = 6371; // km
      
        const x1 = lat2 - lat1;
        const dLat = toRad(x1);
        const x2 = lon2 - lon1;
        const dLon = toRad(x2)
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        //if(isMiles) d /= 1.60934;
        return d;
      }
      
    const getUserLoc = async () => {
        console.log('....getUserLoc called...');
        Geolocation.getCurrentPosition(async (coords) => {
          if (coords && coords.coords && coords.coords.latitude && coords.coords.longitude) {
            setUserLoc(coords.coords);
            console.log('...user loc set as ', coords.coords);
            if (emergencyData.event) {
                // Find facilities for selected event's city
                if (emergencyData.event.city) {
                    try {
                        const resp = await axios.get(CONFIG.URL + '/api/facilities', {
                            params: {
                                city: emergencyData.event.city
                            },
                            headers
                        });
                        setFacilities(resp.data);
                        // Find closest facility for selected event
                        const cfl = resp.data.reduce((prev, curr) =>
                            haversineDistance(prev, coords.coords) > haversineDistance(curr, coords.coords) ? curr : prev);
                        console.log('...cfl: ', cfl);
                        setClosestFac(cfl);
                    } catch (ex) {
                        console.log(ex);
                        setMsg({
                            message: translations.error,
                            type: "warning",
                            duration: 2000,
                          });                    
                    }
                }
                try {
                    // Find demands for selected event
                    const resp = await axios.get(CONFIG.URL + '/api/location-demands', {
                        params: {
                            id: emergencyData.event.id
                        },
                        headers
                    });
                    setDemands(resp.data);
                } catch (ex) {
                    console.log(ex);
                    setMsg({
                        message: translations.error,
                        type: "warning",
                        duration: 2000,
                      });                    
                }
                try {
                    // Find supplies for selected event
                    const resp = await axios.get(CONFIG.URL + '/api/location-supplies', {
                        params: {
                            id: emergencyData.event.id
                        },
                        headers
                    });
                    setSupplies(resp.data);
                } catch (ex) {
                    console.log(ex);
                    setMsg({
                        message: translations.error,
                        type: "warning",
                        duration: 2000,
                      });                    
                }
                try {
                    // Find injuries & emergencies for selected event
                    const resp = await axios.get(CONFIG.URL + '/api/location-emergencies', {
                        params: {
                            id: emergencyData.event.id
                        },
                        headers
                    });
                    setEmergencies(resp.data);
                    setInjuries(resp.data);
                } catch (ex) {
                    console.log(ex);
                    setMsg({
                        message: translations.error,
                        type: "warning",
                        duration: 2000,
                      });                    
                }
            }
          } 
        }, (e) => {
          console.log('location error in map component ', e);
          setMsg({
            message: translations.checkPerm,
            type: "warning",
            duration: 2000,
          });
          return null;
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
    }

    useEffect(() => {
        // Get user's location
        getUserLoc();
    }, [emergencyData.event]);

    return (<>
            <View style={{ height: 60, flexDirection: 'row', backgroundColor: '#48f'}}>
              <Image style={{ flex: 1, height: 60 }}
                  source={require('../assets/ic_launcher.png')}
              />
              <Text style={{ flex: 3, color: '#fff', fontSize: 20, 
                fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>{translations.appTitle}</Text>
              <TouchableOpacity style={{ flex: 1, marginTop: 5 }} onPress={() => switchLang(lang, setLang)}>
                  <View style={{ marginTop: 10,
                      flexDirection: 'row-reverse', flex: 1
                  }} >
                      <Image style={
                      lang == 'en' ?
                          { opacity: 0.3, marginRight: 10 } :
                          { opacity: 1, marginRight: 10 }}
                      source={require('../assets/united-kingdom-flag-icon-32.png')}
                      />
                      <Image style={
                      lang == 'tr' ?
                          { opacity: 0.3, marginRight: 10} :
                          { opacity: 1, marginRight: 10 }}
                      source={require('../assets/turkey-flag-icon-32.png')}
                      />
                  </View>
              </TouchableOpacity>
            </View>

        <View style={styles.mapcontainer}>
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
                latitude: userLoc ? userLoc.latitude : 40.78825,
                longitude: userLoc ? userLoc.longitude : 29.4324,
                latitudeDelta: 1,
                longitudeDelta: 1,
            }}
            showUserLocation={true} >
            {userLoc ?
            <Marker coordinate={{
                latitude: userLoc.latitude,
                longitude: userLoc.longitude,
            }}>
                <Icon name="male" size={30} color='blue' />
            </Marker> : null}

            {facilities && showFacilities? facilities.map(item => {
                return (
                    <Marker key={item.id} coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }}>
                       <Icon name="map-marker" size={20} color='#598' />
                    </Marker> 
                )
            }) : null}
            {demands && showDemands? demands.map(item => {
                return (
                    <Marker key={item.id} coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }}>
                    <Icon name="life-ring" size={20} color='orange' />
                 </Marker> 
             )
            }) : null}
            {supplies && showSupplies? supplies.map(item => {
                return (
                    <Marker key={item.id} coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }}>
                    <Icon name="hand-o-up" size={20} color='green' />
                 </Marker> 
             )
            }) : null}
            {emergencies && showEmergencies? emergencies.map(item => {
                return (
                    <Marker key={item.id} coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }}>
                    <Icon name="exclamation-circle" size={20} color='#f00' />
                 </Marker> 
             )
            }) : null}
            {injuries && showInjuries? injuries.map(item => {
                return (
                    <Marker key={item.id} coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }}>
                    <Icon name="ambulance" size={20} color='#f88' />
                 </Marker> 
             )
            }) : null}

            {closestFac ? 
              <MapViewDirections
                origin={{latitude: userLoc.latitude, longitude: userLoc.longitude}}
                destination={{latitude: closestFac.latitude, longitude: closestFac.longitude}}
                apikey={GOOGLE_MAPS_APIKEY}
            /> : null }

        </MapView>
        </View>
        <View style={styles.layers}>
            <TouchableOpacity style={showFacilities ? styles.button : styles.button2}
                onPress={() => {setShowFacilities(!showFacilities)}}
            >
                <Icon
                      name="map-marker"
                      size={25}
                      color="white"
                    />
            </TouchableOpacity>
            <TouchableOpacity style={showEmergencies ? styles.button : styles.button2}
                onPress={() => {setShowEmergencies(!showEmergencies)}}
            >
                <Icon
                      name="exclamation-circle"
                      size={25}
                      color="white"
                    />
            </TouchableOpacity>
            <TouchableOpacity style={showInjuries ? styles.button : styles.button2}
                onPress={() => {setShowInjuries(!showInjuries)}}
            >
                <Icon
                      name="ambulance"
                      size={25}
                      color="white"
                    />
            </TouchableOpacity>
            <TouchableOpacity style={showDemands ? styles.button : styles.button2}
                onPress={() => {setShowDemands(!showDemands)}}
            >
                <Icon
                      name="life-ring"
                      size={25}
                      color="white"
                    />
            </TouchableOpacity>
            <TouchableOpacity style={showSupplies ? styles.button : styles.button2}
                onPress={() => {setShowSupplies(!showSupplies)}}
            >
                <Icon
                      name="hand-o-up"
                      size={25}
                      color="white"
                    />
            </TouchableOpacity>
        </View>
        <View style={styles.event}>
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 'bold'}}>{emergencyData.event ? (
                emergencyData.event.disasterDate + ' ' + 
                emergencyData.event.type + ' ' +
                emergencyData.event.city + ' ' +
                emergencyData.event.uniqueId) : ''}</Text>
        </View>

        </>
)}

const styles = StyleSheet.create({
    layers: {
        position: 'absolute',
        top: 90,
        left: 0,
        width: '100%',
        backgroundColor: '#6af',
        height: 35,
        flexDirection: 'row',
        alignContent: 'space-between'
    },
    event: {
        position: 'absolute',
        top: 60,
        left: 0,
        width: '100%',
        backgroundColor: '#6af',
        height: 30,
        flexDirection: 'row',
        alignContent: 'space-between'
    },
    button: {
       backgroundColor: '#6af',
       paddingLeft: 25,
       paddingTop: 5,
       flex: 1,
    },
    button2: {
        backgroundColor: '#8cf',
        paddingLeft: 25,
        paddingTop: 5,
        flex: 1,
     },
     mapcontainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
  },
  map: {
        ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
