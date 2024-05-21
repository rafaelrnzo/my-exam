import { View, Text, TouchableOpacity, Button, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../../constant/ip";
import { useNavigation } from "@react-navigation/native";
import { useLogout } from "../../utils/useLogout";
import { useApi } from "../../utils/useApi";

const SubsPage = () => {
  const navigation = useNavigation();
  const { data: subsData, error, isLoading } = useApi(`${BASE_API_URL}item`);
  const { logout } = useLogout();
  const { postData } = useApi();

  const handleSubmit = async (item_name, price, item_id) => {
    try {
      await postData(`${BASE_API_URL}pay`, {
        item_name: item_name,
        price: price,
        item_id: item_id,
      });
      const { data } = response;
      if (data.status === "success" && data.snap_token) {
        navigation.navigate("PaymentScreen", {
          snap_token: data.snap_token,
          pay_token: data.pay_token,
        });
      } else {
        console.log("Failed to process payment. Please try again later.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (error) {
    return <Text>Error loading data</Text>;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <View>
      <Text>SubsPage</Text>
      {subsData.data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={{ padding: 10, borderColor: "black", borderWidth: 1 }}
        >
          <Text>{item.name}</Text>
          <Text>desc: dasdsa{item.description}</Text>
          <Text>{item.price}</Text>
          <Button
            onPress={() => handleSubmit(item.name, item.price, item.id)}
            title="buy"
          />
        </TouchableOpacity>
      ))}
      <Button title="logout" onPress={() => logout()} />
    </View>
  );
};

export default SubsPage;
