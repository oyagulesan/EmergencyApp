import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';

import CommonComponent from '../components/CommonComponent';
import SendSupplyComponent from '../components/SendSupplyComponent';
import TwitterComponent from '../components/TwitterComponent';

const SupplyScreen = () => {

  return <>
        <SafeAreaView>
          <View>
            
            <CommonComponent />

            <SendSupplyComponent />

            <TwitterComponent />

          </View>
        </SafeAreaView>
  </>
}

const styles = StyleSheet.create({

});

export default SupplyScreen;
