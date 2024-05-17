import { Button, ScrollView, Text } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import BASE_API_URL from "../../constant/ip";

const HomePageUser = ({ navigation }) => {
  const [links, setLinks] = useState([]);
  const [belumDikerjakan, setbelumDikerjakan] = useState([]);
  const [status, setStatus] = useState([]);
  const [fields, setFields] = useState({
    name: "",
    password: "",
    token: "",
    role: "",
    //kelas_jurusan: "",
  });

  const getDataLoggedIn = async () => {
    const name = await AsyncStorage.getItem("name");
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");
    //const kelas_jurusan = await AsyncStorage.getItem("kelas_jurusan");
    setFields({
      name: name,
      token: token,
      role: role,
      //kelas_jurusan: kelas_jurusan,
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
      const links = responseData.map((item) => item.link);
      const status = responseData.map((item) => item.status_progress);
      console.log("ini sudah",response.data);
      setLinks(links);
      setStatus(status);
    } catch (error) {
      console.log("Error fetching links:", error);
    }
  };

  const getLinksBelum = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}links`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("ini belum", response.data.data);
      setbelumDikerjakan(response.data.data);
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
      await AsyncStorage.multiRemove(["token","role","name"]);
      navigation.navigate("LoginPage");
    } catch (error) {
      console.log("Error logging out:", error);
      await AsyncStorage.multiRemove(["token","role","name"]);
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
    getDataLoggedIn();
    getLinks();
    getLinksBelum();
  }, []);

  return (
    <ScrollView style={{ flexDirection: "column", flex: 1, padding: 10 }}>
      <Text>name: {fields.name}</Text>
      {/* <Text>kelas_jurusan: {fields.kelas_jurusan}</Text> */}
      <Button title="logout" onPress={() => logoutUser()} />
      <Text>Belum Dikerjakan</Text>

      {belumDikerjakan.length > 0 ? (
        belumDikerjakan.map((item) => (
          <Card
            key={item.id}
            press={() => createProgress(item.id, item.link_name)}
            link_title={item.link_title} 
            link_status={item.link_status} 
            // kelas_jurusan={item.kelas_jurusan}
          />
        ))
      ) : (
        <Text>No links available</Text>
      )}
      <Text>Sudah Dikerjakan</Text>
      {links.length > 0 ? (
        links.map((item, index) => (
          <Card
            key={item.id}
            press={() => console.log('t')}
            link_title={item.link_title} 
            link_status={item.link_status} 
            status_progress={status[index]} 
            // kelas_jurusan={item.kelas_jurusan}
          />
        ))
      ) : (
        <Text>No links available</Text>
      )}
    </ScrollView>
  );
};

export default HomePageUser;
