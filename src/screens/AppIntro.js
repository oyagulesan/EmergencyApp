import React, { useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { switchLang, Context as AppContext, translations } from '../context/AppContext';

const AppIntro = ({ navigation }) => {
  const os = Platform.OS;

  const { state: { lang, isInit, translations }, setIsInit, setLang, initialize } = useContext(AppContext);

  const toggleLang = () => {
    switchLang(lang, setLang);
  }

  const onDone = () => {
    setIsInit(false);
    navigation.navigate('mainFlow');
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isInit === false) {
      navigation.navigate('mainFlow');
    }
  }, [isInit])

  renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image style={styles.img} source={item.image[os][lang]} />
        <TouchableOpacity style={styles.lang} onPress={toggleLang} />
      </View>
    );
  }
  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.txt}>{translations.next}</Text>
      </View>
    );
  };
  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.txt}>{translations.done}</Text>
      </View>
    );
  };

  const renderSkipButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.txt}>{translations.skip}</Text>
      </View>
    );
  };
  
  const slides = [
    {
      key: '1',
      image: {
        'android': {
          'tr': require('../assets/android_tr_1.png'),
          'en': require('../assets/android_en_1.png')
        },
        'ios': {
          'tr': require('../assets/ios_tr_1.png'),
          'en': require('../assets/ios_en_1.png')
        }
      }
    },
    {
      key: '2',
      image: {
        'android': {
          'tr': require('../assets/android_tr_2.png'),
          'en': require('../assets/android_en_2.png')
        },
        'ios': {
          'tr': require('../assets/ios_tr_2.png'),
          'en': require('../assets/ios_en_2.png')
        }
      }
    },
    {
      key: '3',
      image: {
        'android': {
          'tr': require('../assets/android_tr_3.png'),
          'en': require('../assets/android_en_3.png')
        },
        'ios': {
          'tr': require('../assets/ios_tr_3.png'),
          'en': require('../assets/ios_en_3.png')
        }
      }
    },
    {
      key: '4',
      image: {
        'android': {
          'tr': require('../assets/android_tr_4.png'),
          'en': require('../assets/android_en_4.png')
        },
        'ios': {
          'tr': require('../assets/ios_tr_4.png'),
          'en': require('../assets/ios_en_4.png')
        }
      }
    },
    {
      key: '5',
      image: {
        'android': {
          'tr': require('../assets/android_tr_5.png'),
          'en': require('../assets/android_en_5.png')
        },
        'ios': {
          'tr': require('../assets/ios_tr_5.png'),
          'en': require('../assets/ios_en_5.png')
        }
      }
    },
    {
      key: '6',
      image: {
        'android': {
          'tr': require('../assets/android_tr_6.png'),
          'en': require('../assets/android_en_6.png')
        },
        'ios': {
          'tr': require('../assets/ios_tr_6.png'),
          'en': require('../assets/ios_en_6.png')
        }
      }
    },
    {
      key: '7',
      image: {
        'android': {
          'tr': require('../assets/android_tr_7.png'),
          'en': require('../assets/android_en_7.png')
        },
        'ios': {
          'tr': require('../assets/ios_tr_7.png'),
          'en': require('../assets/ios_en_7.png')
        }
      }
    },
    {
      key: '8',
      image: {
        'android': {
          'tr': require('../assets/android_tr_8.png'),
          'en': require('../assets/android_en_8.png')
        },
        'ios': {
          'tr': require('../assets/ios_tr_8.png'),
          'en': require('../assets/ios_en_8.png')
        }
      }
    },
  ];

  return <AppIntroSlider renderItem={renderItem} 
    data={slides} 
    onDone={onDone} 
    onSkip={onDone}
    renderDoneButton={renderDoneButton}
    renderNextButton={renderNextButton}
    renderSkipButton={renderSkipButton}
    showSkipButton={true} />;

};


const styles = StyleSheet.create({
  slide: {
    width: '100%', height: '100%',
  },
  buttonCircle: {
    backgroundColor: '#48f',
    borderRadius: 30,
    padding: 10
  },
  txt: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  img: {
    width: '100%', height: '100%',
    resizeMode: 'stretch'
  },
  lang: {
    position: 'absolute',
    height: 80,
    width: 100,
    top: 20,
    right: 5,
    borderColor: 'red',
    borderWidth: 0
  }
});

export default AppIntro;