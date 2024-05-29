import useSWR from 'swr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Helper function to get token
const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// Custom fetcher for SWR
export const fetcher = async (url) => {
  const token = await getToken();
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useApi = (initialUrl) => {
  const { data, error, mutate } = useSWR(initialUrl, { revalidateOnFocus: true });

  const postData = async (url, newData) => {
    try {
      const token = await getToken();
      const response = await axios.post(url, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate(url); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  };

  const putData = async (url, updatedData) => {
    try {
      const token = await getToken();
      const response = await axios.put(url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate(url); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  };

  const deleteData = async (url) => {
    try {
      const token = await getToken();
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate(url); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error deleting data:", error);
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
