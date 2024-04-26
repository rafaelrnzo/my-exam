import { Button, ScrollView, Text } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import BASE_API_URL from "../../constant/ip";

const HomePageUser = ({ navigation }) => {
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState([]);
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
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = response.data.data;
      const links = responseData.map(item => item.link);
      const status = responseData.map(item => item.status_progress);
      setLinks(links);
      setStatus(status);
    } catch (error) {
      console.log("Error fetching links:", error);
    }
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
      console.log("Error logging out:", error);
      await AsyncStorage.removeItem("token");
      navigation.navigate("LoginPage");
    }
  };

  const createProgress = async (id, link_name) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${BASE_API_URL}progress/post`,
        {
          link_id: id,
          status_progress: "dikerjakan",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigation.navigate("UjianPageUser", {
        link_id: id,
        link_name: link_name.toString(),
      });
    } catch (error) {
      console.log("Error creating progress:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDataLoggedIn();
      await getLinks();
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={{ flexDirection: "column", flex: 1, padding: 10 }}>
      <Text>name: {fields.name}</Text>
      <Text>kelas_jurusan: {fields.kelas_jurusan}</Text>
      <Button title="logout" onPress={() => logoutUser()} />
      <Text>ini link ujian</Text>

      {links.length > 0 ? (
        links.map((item, index) => (
          <Card
            key={item.id}
            press={() => createProgress(item.id, item.link_name)}
            link_title={item.link_title} // Pastikan nama properti ini sesuai dengan respons dari server
            link_status={item.link_status} // Pastikan nama properti ini sesuai dengan respons dari server
            status_progress={status[index]} // Menggunakan status yang sesuai dengan indeks
            kelas_jurusan={item.kelas_jurusan}
          />
        ))
      ) : (
        <Text>No links available</Text>
      )}
    </ScrollView>
  );
};

export default HomePageUser;
