import React, { useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
} from 'react-native';

import { sendEmergency, Context as AppContext } from '../context/AppContext';
import RoundButton from './RoundButton';

const SendInjuredComponent = () => {

    const { state: { headers, emergencyData, translations }, setEmergencyData, resetData } = useContext(AppContext);

    return (
        <View style={{height: '35%', backgroundColor: '#325' }}>
        <View style={{ alignContent: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#6af', textAlign: 'center', fontWeight: 'bold', fontSize: 30 }}>{translations.injured}</Text>
        </View>
        <View>
            <View style={{ flexDirection: 'row', alignContent: 'center', paddingLeft: 30 }}>
                <RoundButton title={'-'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    emergency: (emergencyData.injured == 0 ? 0 : emergencyData.injured - 1)
                })}
                />
                <TextInput
                    style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', borderColor: 'white', 
                        textAlign: 'center', width: '30%', height: 40, borderWidth: 1, marginBottom: 10 }}
                    keyboardType={'numeric'}
                    value={'' + emergencyData.injured}
                    editable={false}
                />
                <RoundButton title={'+'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    injured: emergencyData.injured + 1
                })}
                />
            </View>
            <RoundButton disabled={emergencyData.injured == 0}
                style={{ marginTop: 30, height: 40, width: 200 }}
                title={translations.sendInjured} 
                onPress={() => sendEmergency(headers, emergencyData, translations, resetData)} 
            />
        </View>
    </View>
)}

const styles = StyleSheet.create({
});

export default SendInjuredComponent;
