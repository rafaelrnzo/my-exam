import useSWR from 'swr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const useApi = (initialUrl) => {
  const { data, error, mutate } = useSWR(initialUrl, fetcher);

  const postData = async (url, newData) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(url, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const putData = async (url, updatedData) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.put(url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate(); // Revalidate the data
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteData = async (url) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    data,
    error,
    isLoading: !error && !data,
    mutate,
    postData,
    putData,
    deleteData
  };
};

export const fetcher = async (url) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
