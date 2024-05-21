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
      await AsyncStorage.multiRemove(['token', 'role', 'name']);
      navigation.navigate('PortalPage');
    } catch (error) {
      console.log('Error logging out:', error);
      await AsyncStorage.multiRemove(['token', 'role', 'name']);
      navigation.navigate('PortalPage');
    }
  };

  return { logout };
};
