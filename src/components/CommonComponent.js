import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  StatusBar,
  Image
} from 'react-native';

import { Picker } from '@react-native-community/picker';
import FlashMessage from "react-native-flash-message";
import AnimatedLoader from "react-native-animated-loader";
import { switchLang, Context as AppContext } from '../context/AppContext';

const CommonComponent = () => {

  const { state: { translations, lang, emergencyData: { loading, event, eventList } }, setEvent, setLang } = useContext(AppContext);
  
  const FadeInView = (props) => {
    const [anim, setAnim] = useState(new Animated.Value(0));
    const fadeAnim = useRef(anim).current  // Initial value for opacity: 0
    const [targetAnim, setTargetAnim] = useState(0);

    useEffect(() => {
      const t = setTimeout(() => { setTargetAnim(targetAnim == 0 ? 1 : 0) }, 750);
      let a1;
      let a2;
      if (targetAnim == 0) {
        a1 = Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
          }
        );
        a1.start();
      } else {
        a2 = Animated.timing(
          fadeAnim,
          {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
          }
        )
        a2.start();
      }
      return () => {
        anim.stopAnimation();
        clearTimeout(t);
      }
    }, [targetAnim])

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        {props.children}
      </Animated.View>
    );
  }

  return <>
    { loading ? <AnimatedLoader
      visible={true}
      overlayColor="rgba(255,255,255,0.75)"
      source={require("../../res-29574-dot-loader-3.json")}
      animationStyle={styles.lottie}
      speed={1}
    />
      : <View
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>

            <StatusBar barStyle="dark-content" />
            <FlashMessage position="top" />
            <TouchableOpacity style={{marginLeft: 300, marginTop: 5, borderWidth: 0, borderColor: 'black', height: 40}} onPress={() => switchLang(lang, setLang)}>
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
            <FadeInView>
              <View style={{
                  backgroundColor: '#cdf', height: 50,
                  borderRadius: 20, marginLeft: 20, marginRight: 20, marginTop: 5, padding: 5,
                  borderColor: '#cac', borderWidth: 2,                  
                }}>
                <Text style={{textAlignVertical: 'center', textAlign: 'center', color: '#f00', fontSize: 25, fontWeight: 'bold'}}>
                  {translations.title}
                </Text>
              </View>
            </FadeInView>
            <Text style={{
              marginTop: 0, fontSize: 20,
              fontWeight: 'bold', textAlign: 'center', color: 'white'
            }}>
              {translations.selectEvent}
            </Text>
            {eventList && eventList.length > 0 ?
              <View style={{ borderColor: 'white', borderRadius: 20, borderWidth: 2, marginBottom: 20, marginHorizontal: 10 }}>
                <Picker
                  selectedValue={event.id}
                  itemStyle={{ backgroundColor: "#325", borderRadius: 20, height: 100}}
                  onValueChange={(itemValue, itemIndex) => setEvent(itemValue)}
                >
                  {
                    eventList.map(e => <Picker.Item key={e.id}
                      label={e.disasterDate + ' ' + e.city + ' ' + e.type + ' ' + e.uniqueId}
                      color='#fff'
                      value={e.id} />)
                  }
                </Picker>
              </View>
              : null
            }
          </View>
    }
  </>
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#325',
    justifyContent: 'space-between',
    height: '45%',
  },
  lottie: {
    width: 100,
    height: 100
  }
});

export default CommonComponent;
