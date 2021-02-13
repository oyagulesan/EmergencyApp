import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';
import CommonComponent from '../components/CommonComponent';
import SendInjuredComponent from '../components/SendInjuredComponent';
import TwitterComponent from '../components/TwitterComponent';

const InjuredScreen = () => {

  return <>
    <SafeAreaView>
      <View>
        <CommonComponent />
        <SendInjuredComponent />
        <TwitterComponent />
      </View>
    </SafeAreaView>
  </>
}

const styles = StyleSheet.create({

});

export default InjuredScreen;
