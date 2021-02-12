import React, { useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
} from 'react-native';

import { sendEmergency, Context as AppContext } from '../context/AppContext';
import RoundButton from '../components/RoundButton';

const SendEmergencyComponent = () => {

    const { state: { headers, emergencyData, translations }, setEmergencyData, resetData } = useContext(AppContext);

    return (
    <View style={{height: '35%', backgroundColor: '#325' }}>
        <View style={{ alignContent: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#6af', textAlign: 'center', fontWeight: 'bold', fontSize: 30 }}>{translations.emergencyTitle}</Text>
        </View>
        <View>
            <View style={{ flexDirection: 'row', alignContent: 'center', paddingLeft: 30 }}>
                <RoundButton title={'-'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    emergency: (emergencyData.emergency == 0 ? 0 : emergencyData.emergency - 1)
                })}
                />
                <TextInput
                    style={{ alignSelf: 'center', color: 'white', fontWeight: 'bold', borderColor: 'white', textAlign: 'center', width: '30%', height: 40, borderWidth: 1, marginBottom: 10 }}
                    keyboardType={'numeric'}
                    value={'' + emergencyData.emergency}
                    editable={false}
                />
                <RoundButton title={'+'} onPress={() => setEmergencyData({
                    ...emergencyData,
                    emergency: emergencyData.emergency + 1
                })}
                />
            </View>
            <RoundButton disabled={emergencyData.emergency == 0}
                style={{ marginTop: 30, height: 40, width: 200 }}
                title={translations.sendEmergency} 
                onPress={() => sendEmergency(headers, emergencyData, translations, resetData)} 
            />
        </View>
    </View>
)}

const styles = StyleSheet.create({
});

export default SendEmergencyComponent;
