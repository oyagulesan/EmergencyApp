import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const MapComponent = () => {

    return (
        <View style={styles.mapcontainer}>
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
                latitude: 40.78825,
                longitude: 29.4324,
                latitudeDelta: 5,
                longitudeDelta: 10,
            }}
            showUserLocation={true} >
            <Marker coordinate={{
                latitude: 40.78825,
                longitude: 29.4324,
            }}  />
        </MapView>
        </View>
)}

const styles = StyleSheet.create({
    mapcontainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
  },
  map: {
        ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
