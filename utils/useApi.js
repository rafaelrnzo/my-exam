import { useQuery, useMutation, useQueryClient } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Helper function to get token
const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// Fetcher function
const fetcher = async ({ queryKey }) => {
  const [url] = queryKey;
  const token = await getToken();
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useApi = (initialUrl) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery([initialUrl], fetcher, {
    refetchOnWindowFocus: true,
  });
  const postData = useMutation(
    async ({ url, newData }) => {
      const token = await getToken();
      const response = await axios.post(url, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([initialUrl]);
      },
    }
  );

  const putData = useMutation(
    async ({ url, updatedData }) => {
      const token = await getToken();
      const response = await axios.put(url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([initialUrl]);
      },
    }
  );

  const deleteData = useMutation(
    async (url) => {
      const token = await getToken();
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([initialUrl]);
      },
    }
  );

  return {
    data,
    error,
    isLoading,
    postData: postData.mutateAsync,
    putData: putData.mutateAsync,
    deleteData: deleteData.mutateAsync,
    mutate: () => queryClient.invalidateQueries([initialUrl]),
  };
};
