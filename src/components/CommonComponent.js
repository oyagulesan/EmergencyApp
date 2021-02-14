import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-community/picker';
import AnimatedLoader from "react-native-animated-loader";
import { switchLang, Context as AppContext } from '../context/AppContext';
import { showMessage, hideMessage } from "react-native-flash-message";

const CommonComponent = ({ navigation }) => {

  const { state: { translations, lang, msg, emergencyData: { loading, event, eventList } }, 
    initialize, setIsInit, setEvent, setLang, setMsg, resetMsg } = useContext(AppContext);

  let tmr = null;

  useEffect(() => {
    if (msg) {
      if (tmr) {
        clearTimeout(tmr);
      }
      tmr = setTimeout(() => resetMsg(), 2100);
      console.log('...show msg..common.', msg);
      showMessage(msg);
    }
    return () => {
      if (tmr) {
        clearTimeout(tmr);
      }
    }

  }, [msg]);

  const navigateToAppIntro = () => {
    setIsInit(true);
    navigation.navigate('AppIntro');
  }

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
    /> : null}
      <View
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>

        <View style={{ height: 60, flexDirection: 'row', backgroundColor: '#48f' }}>
          <TouchableOpacity style={{ flex: 2, height: 60 }} onPress={initialize}>
            <Image style={{ flex: 1, height: 60 }}
              source={require('../assets/ic_launcher.png')}
            />
          </TouchableOpacity>
          <Text style={{
            flex: 5, color: '#fff', fontSize: 20,
            fontWeight: 'bold', textAlign: 'center', marginTop: 10
          }}>{translations.appTitle}</Text>
          <TouchableOpacity style={{ flex: 2, marginTop: 5 }} onPress={() => switchLang(lang, setLang)}>
            <View style={{
              marginTop: 10,
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
                  { opacity: 0.3, marginRight: 10 } :
                  { opacity: 1, marginRight: 10 }}
                source={require('../assets/turkey-flag-icon-32.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, marginTop: 5 }} onPress={navigateToAppIntro}>
            <Icon
              name="question"
              size={25}
              color="white"
            />
          </TouchableOpacity>

        </View>

        <FadeInView>
          <View style={{
            backgroundColor: '#cdf', height: 50,
            borderRadius: 20, marginLeft: 20, marginRight: 20, marginTop: 5, padding: 5,
            borderColor: '#cac', borderWidth: 2,
          }}>
            <Text style={{ textAlignVertical: 'center', textAlign: 'center', color: '#f00', fontSize: 25, fontWeight: 'bold' }}>
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
              itemStyle={{ backgroundColor: "#325", borderRadius: 20, height: 100 }}
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
    
  </>
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#325',
    justifyContent: 'space-between',
    height: '45%',
    width: '100%'
  },
  lottie: {
    width: 100,
    height: 100
  }
});

export default CommonComponent;
