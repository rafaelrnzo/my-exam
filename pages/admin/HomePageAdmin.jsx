import { View, Text, Button } from 'react-native'
import React from 'react'
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from '../../constant/ip';

const HomePageAdmin = ({navigation}) => {
  const logout = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `${BASE_API_URL}logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await AsyncStorage.multiRemove(["token", "role"]);
      navigation.replace("LoginPage");
    } catch (error) {
      await AsyncStorage.multiRemove(["token", "role"]);
      navigation.replace("LoginPage");
    }
  };
  return (
    <View>
      <Text>HomePageAdmin</Text>
      <Button title='logout' onPress={logout} />
    </View>
  )
}

export default HomePageAdmin