import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';
import CommonComponent from '../components/CommonComponent';
import SendInjuredComponent from '../components/SendInjuredComponent';
import TwitterComponent from '../components/TwitterComponent';

const InjuredScreen = ({ navigation }) => {

  return <>
    <SafeAreaView>
      <View>
        <CommonComponent navigation={navigation}/>
        <SendInjuredComponent />
        <TwitterComponent />
      </View>
    </SafeAreaView>
  </>
}

const styles = StyleSheet.create({

});

export default InjuredScreen;
