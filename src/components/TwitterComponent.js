import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';

import { sendTweet, Context as AppContext } from '../context/AppContext';

const TwitterComponent = () => {

  const { state: { emergencyData, translations }, resetData } = useContext(AppContext);

  return <View style={{ height: '20%', backgroundColor: '#325'}}>
    <Text style={emergencyData.supply == 0 && 
    emergencyData.demand == 0 && emergencyData.injured == 0 && emergencyData.emergency == 0 ? 
    { textAlign: 'center', color: '#6af', fontWeight: 'bold', fontSize: 25, marginBottom: 20, opacity: 0.5} :
    { textAlign: 'center', color: '#6af', fontWeight: 'bold', fontSize: 25, marginBottom: 20}}>{translations.sendTweet}</Text>
  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
  <TouchableOpacity disabled={emergencyData.supply == 0 && 
    emergencyData.demand == 0 && emergencyData.injured == 0 && emergencyData.emergency == 0} onPress={() => sendTweet(emergencyData, translations, resetData)}>
    <Image
      style={emergencyData.supply == 0 && 
        emergencyData.demand == 0 && emergencyData.injured == 0 && emergencyData.emergency == 0 ?
        { width: 50, height: 50, opacity: 0.3 } : { width: 50, height: 50, marginTop: 0 }}
      source={require('../assets/twitter.png')}
    />
  </TouchableOpacity>
</View>

  </View>

}

const styles = StyleSheet.create({

});

export default TwitterComponent;
