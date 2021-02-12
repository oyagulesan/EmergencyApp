import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';

import CommonComponent from '../components/CommonComponent';
import SendEmergencyComponent from '../components/SendEmergencyComponent';
import TwitterComponent from '../components/TwitterComponent';

const EmergencyScreen = () => {

  return <>
    <SafeAreaView>
      <View>

        <CommonComponent />

        <SendEmergencyComponent />

        <TwitterComponent />

      </View>
    </SafeAreaView>
  </>
}

const styles = StyleSheet.create({

});

export default EmergencyScreen;
