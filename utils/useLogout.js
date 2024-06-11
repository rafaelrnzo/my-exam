// useLogout.js
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_API_URL from '../constant/ip';

export const useLogout = () => {
  const navigation = useNavigation();

  const logout = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(
        `${BASE_API_URL}logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('logging out');
      await AsyncStorage.multiRemove(['token', 'role', 'name']);
      navigation.replace('PortalPage');
    } catch (error) {
      console.log(error);
      navigation.replace('PortalPage');
      await AsyncStorage.multiRemove(['token', 'role', 'name']);
    }
  };

  return { logout };
};
