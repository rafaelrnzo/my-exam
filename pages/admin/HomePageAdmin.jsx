import { SafeAreaView, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_API_URL from "../../constant/ip";
import Card from "../../components/Card";

const HomePageAdmin = ({ navigation }) => {
  const logout = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.post(
        `${BASE_API_URL}logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await AsyncStorage.multiRemove([
        "token",
        "role",
        "name",
        "kelas_jurusan",
      ]);
      navigation.replace("LoginPage");
    } catch (error) {
      await AsyncStorage.multiRemove([
        "token",
        "role",
        "name",
        "kelas_jurusan",
      ]);
      navigation.replace("LoginPage");
    }
  };

  const [links, setLinks] = useState([]);

  const getLinks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BASE_API_URL}admin-sekolah/links`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLinks(response.data.data);
    } catch (error) {
      console.log("Error fetching links:", error);
    }
  };

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <SafeAreaView style={{ padding: 4 }}>
      <Text>HomePageAdmin</Text>
      {links.length > 0 ? (
        links.map((item) => (
          <Card
            key={item.id}
            press={() =>
              navigation.push("UpdateLinkAdmin", {
                link_title: item.link_title,
                link_status: item.link_status,
                kelas_jurusan: item.kelas_jurusan,
                link_name: item.link_name,
                id: item.id
              })
            }
            link_title={item.link_title}
            link_status={item.link_status}
            kelas_jurusan={item.kelas_jurusan}
          />
        ))
      ) : (
        <Text>No links available</Text>
      )}
      <Button
        title="Create link"
        onPress={() => navigation.push("CreateLinkAdmin")}
      />
      <Button title="logout" onPress={logout} />
    </SafeAreaView>
  );
};

export default HomePageAdmin;
