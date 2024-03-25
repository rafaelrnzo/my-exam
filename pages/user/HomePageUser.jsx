import { Button, ScrollView, Text } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import BASE_API_URL from "../../constant/ip";

const HomePageUser = ({ navigation }) => {
  const [links, setlinks] = useState([]);
  const [fields, setFields] = useState({
    name: "",
    password: "",
    token: "",
    role: "",
    kelas_jurusan: "",
  });

  const getDataLoggedIn = async () => {
    const name = await AsyncStorage.getItem("name");
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");
    const kelas_jurusan = await AsyncStorage.getItem("kelas_jurusan");
    setFields({
      name: name,
      token: token,
      role: role,
      kelas_jurusan: kelas_jurusan,
    });
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
  
  const logoutUser = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `${BASE_API_URL}logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await AsyncStorage.removeItem("token");
      navigation.navigate("LoginPage");
    } catch (error) {
      await AsyncStorage.removeItem("token");
      navigation.navigate("LoginPage");
    }
  };

  useEffect(() => {
    getLinks();
    getDataLoggedIn();
  }, []);

  return (
    <ScrollView style={{ flexDirection: "column", flex: 1 }}>
      <Text>name: {fields.name}</Text>
      <Text>role: {fields.role}</Text>
      <Text>token: {fields.token}</Text>
      <Text>kelas_jurusan: {fields.kelas_jurusan}</Text>
      <Button title="tes" onPress={() => verifySerialNumber()} />
      <Button title="logout" onPress={() => logoutUser()} />
      <Text>ini link ujian</Text>
      {links.map((item) => (
        <Card
          key={item.id}
          press={() => navigation.navigate("UjianPageUser")}
          link_name={item.link_name}
          link_title={item.link_title}
          link_status={item.link_status}
          kelas_jurusan={item.kelas_jurusan}
        />
      ))}
    </ScrollView>
  );
};

export default HomePageUser;
