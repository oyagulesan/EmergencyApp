import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';

import CommonComponent from '../components/CommonComponent';
import SendDemandComponent from '../components/SendDemandComponent';
import TwitterComponent from '../components/TwitterComponent';

const DemandScreen = () => {

  return <>
    <SafeAreaView>
      <View>

        <CommonComponent />

        <SendDemandComponent />

        <TwitterComponent />
      </View>
    </SafeAreaView>
  </>
}

const styles = StyleSheet.create({

});

export default DemandScreen;
