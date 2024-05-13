import { View, Text, SafeAreaView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../../constant/ip";

const MonitoringPage = () => {
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [paginations, setpaginations] = useState([]);
  const [status, setStatus] = useState([]);
  // const [date, setDate] = useState([]);
  const getUserProgress = async (url = '') => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(url == '' ? 
        `${BASE_API_URL}admin-sekolah/monitoring` : url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data.data.data;
      const userProgress = responseData.map((item) => item.user);
      const linkProgress = responseData.map((item) => item.link);
      const status = responseData.map((item) => item.status_progress);
      setUsers(userProgress);
      setLinks(linkProgress);
      setStatus(status);
      setpaginations(response.data.data.links)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProgress();
  }, []);

  return (
    <SafeAreaView style={{ padding: 20 }}>
      {paginations.length !== 0 ? (
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}
        >
          {paginations.map((item, index) => (
            <Button
              key={index}
              onPress={() => getUserProgress(item.url)}
              title={item.label}
            />
          ))}
        </View>
      ) : null}
      {users.map((item, index) => (
        <View style={{ flexDirection: "row" }}>
          <Text>{item.name}</Text>
          <Text>{links[index]?.link_title}</Text>
          <Text>{status[index]}</Text>
        </View>
      ))}
    </SafeAreaView>
  );
};

export default MonitoringPage;
