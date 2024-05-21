import React, { useEffect, useState } from 'react';
import { ScrollView, Text, Button, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApi } from '../../utils/useApi';
import Card from '../../components/Card';
import BASE_API_URL from '../../constant/ip';
import { useLogout } from '../../utils/useLogout';

const HomePageUser = ({ navigation }) => {
  const [fields, setFields] = useState({
    name: "",
    password: "",
    token: "",
    role: "",
    kelas_jurusan: "",
  });

  const { data: userData, error: userError } = useApi(`${BASE_API_URL}get-data-login`);
  const { data: progressData, error: progressError } = useApi(`${BASE_API_URL}progress`);
  const { data: linksData, error: linksError } = useApi(`${BASE_API_URL}links`);
  const { postData } = useApi();
  const {logout} = useLogout()

  useEffect(() => {
    if (userData) {
      const token = AsyncStorage.getItem("token");
      setFields({
        name: userData.name,
        token: token,
        role: userData.role,
        kelas_jurusan: userData.kelas_jurusan,
      });
    }
  }, [userData]);

  const createProgress = async (id, link_name) => {
    try {
      await postData(`${BASE_API_URL}progress/post`, {
        link_id: id,
        status_progress: "dikerjakan",
      });
      navigation.navigate("UjianPageUser", {
        link_id: id,
        link_name: link_name.toString(),
      });
    } catch (error) {
      console.log("Error creating progress:", error);
    }
  };

  if (userError || progressError || linksError) {
    return <Text>Error loading data</Text>;
  }

  if (!userData || !progressData || !linksData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  const links = progressData.data.map((item) => item.link);
  const status = progressData.data.map((item) => item.status_progress);
  const belumDikerjakan = linksData.data;

  return (
    <ScrollView style={{ flexDirection: "column", flex: 1, padding: 10 }}>
      <Text>name: {fields.name}</Text>
      <Text>Ujian untuk kelas: {fields.kelas_jurusan}</Text>
      <Button title="logout" onPress={() => logout()} />
      <Text>Belum Dikerjakan</Text>

      {belumDikerjakan.length > 0 ? (
        belumDikerjakan.map((item) => (
          <Card
            key={item.id}
            press={() => createProgress(item.id, item.link_name)}
            link_title={item.link_title}
            link_status={item.link_status}
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
            press={() => console.log("t")}
            link_title={item.link_title}
            link_status={item.link_status}
            status_progress={status[index]}
          />
        ))
      ) : (
        <Text>No links available</Text>
      )}
    </ScrollView>
  );
};

export default HomePageUser;
