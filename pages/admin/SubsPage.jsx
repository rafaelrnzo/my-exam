import { View, Text, TouchableOpacity, Button } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../../constant/ip";
import { useNavigation } from '@react-navigation/native';

const SubsPage = () => {
  const [subsData, setSubsData] = useState([]);

  const getSubsData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}item`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubsData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (item_name, price, item_id) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        `${BASE_API_URL}pay`,
        {
          item_name: item_name,
          price: price,
          item_id: item_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { data } = response;
      console.log(data);
      if (data.status === "success" && data.snap_token) {
        navigation.navigate('PaymentScreen', {snap_token: data.snap_token, pay_token: data.pay_token})
      } else {
        console.log("Failed to process payment. Please try again later.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubsData();
  }, []);

  const navigation = useNavigation();

  return (
    <View>
      <Text>SubsPage</Text>
      {subsData.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={{ padding: 10, borderColor: "black", borderWidth: 1 }}
        >
          <Text>{item.name}</Text>
          <Text>desc: dasdsa{item.description}</Text>
          <Text>{item.price}</Text>
          <Button onPress={() => handleSubmit(item.name, item.price, item.id)} title="buy" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SubsPage;
