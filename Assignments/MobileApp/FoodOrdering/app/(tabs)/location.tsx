import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import useUserId from '../../components/getuser';
import axios from 'axios';

const LocationScreens = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shareableLocation, setShareableLocation] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [usersLocations, setUsersLocations] = useState<any[]>([]);
  const userId = useUserId(); // Use the custom hook to get user ID

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const response = await axios.get('http://143.198.158.17:8084/user_locations');
        setUsersLocations(response.data);
      } catch (error) {
        console.error('Error fetching user locations:', error);
        setErrorMsg('Error fetching user locations');
      }
    };

    fetchUserLocations();
  }, []);

  
  
  useEffect(() => {
    console.log(location?.coords.latitude);
}, [location]);

useEffect(() => {
  console.log(location?.coords.longitude);
}, [location]);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {usersLocations.map(userLocation => (
            <Marker
              key={userLocation.user_id} // Assuming each user location has a unique ID
              coordinate={{
                latitude: userLocation.latitude,
                longitude: -userLocation.longitude,
               

              }}
              title={`${userLocation.first_name} ${userLocation.last_name}`}
            />
          ))}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="My Location"
          />
        </MapView>
      ) : (
        <Text>{errorMsg || 'Waiting for location...'}</Text>
      )}

      <Button title="Share Location" />

      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
      />

      {shareableLocation && <Text>{shareableLocation}</Text>}
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default LocationScreens;
