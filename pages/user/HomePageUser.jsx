import { ScrollView, Text } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import BASE_API_URL from "../../constant/ip";

const HomePageUser = ({ navigation }) => {
  const [links, setlinks] = useState([]);
  const [name, setname] = useState("");
  const [token, settoken] = useState("");
  const [role, setrole] = useState("");

  const getDataLoggedIn = async () => {
    const name = await AsyncStorage.getItem("name");
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");
    setname(name);
    setrole(role);
    settoken(token);
  };

  const getLinks = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${BASE_API_URL}links`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setlinks(response.data.data);
  };

  useEffect(() => {
    getLinks();
    getDataLoggedIn();
  }, []);

  return (
    <ScrollView style={{ flexDirection: "column", flex: 1 }}>
      <Text>name: {name}</Text>
      <Text>role: {role}</Text>
      <Text>{token}</Text>
      {links.map((item) => (
        <Card
          key={item.id}
          press={() => navigation.navigate("UjianPageUser")}
          link_name={item.link_name}
          link_title={item.link_title}
          link_status={item.link_status}
        />
      ))}
    </ScrollView>
  );
};

export default HomePageUser;
