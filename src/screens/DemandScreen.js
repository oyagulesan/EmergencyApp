import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';

import CommonComponent from '../components/CommonComponent';
import SendDemandComponent from '../components/SendDemandComponent';
import TwitterComponent from '../components/TwitterComponent';

const DemandScreen = ({ navigation }) => {

  return <>
    <SafeAreaView>
      <View>

        <CommonComponent navigation={navigation}/>

        <SendDemandComponent />

        <TwitterComponent />
      </View>
    </SafeAreaView>
  </>
}

const styles = StyleSheet.create({

});

export default DemandScreen;
