import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import MapComponent from '../components/MapComponent';

const HomeScreen = () => {

  const requestPermission = async () => {
    console.log('...request perm...');
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(
        (result) => {
          switch (result) {
            case RESULTS.GRANTED:
              console.log('The permission ACCESS_COARSE_LOCATION is granted');
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
            console.log('The permission LOCATION_WHEN_IN_USE is now granted');
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
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(
        async (result) => {
          switch (result) {
            case RESULTS.GRANTED:
              console.log('The permission ACCESS_COARSE_LOCATION is already granted');
              break;
            default:
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
              console.log('The permission LOCATION_WHEN_IN_USE is already granted');
              break;
            default:
              await requestPermission();
              // console.log('The permission LOCATION_WHEN_IN_USE is denied...' + result);
              break;
          }
        }
      )
    }
  }

  useEffect(() => {
    checkPermission();
  }, [])

  return <>
        <SafeAreaView>
          <View>
            <MapComponent />
          </View>
        </SafeAreaView>
  </>
}

const styles = StyleSheet.create({

});

export default HomeScreen;
