import React, { useEffect, useState } from 'react';
import { ScrollView, Text, Button, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApi } from '../../utils/useApi';
import BASE_API_URL from '../../constant/ip';
import { useLogout } from '../../utils/useLogout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { textTitle } from '../../assets/style/basic';
import Card from '../admin/components/CardLinkAdmin';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
  const { logout } = useLogout()

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

  const createProgress = async (id, link_name, link_title, waktu_pengerjaan) => {
    try {
      await postData(`${BASE_API_URL}progress/post`, {
        link_id: id,
        status_progress: "dikerjakan",
      });
      navigation.navigate("UjianPageUser", {
        link_id: id,
        link_name: link_name.toString(),
        link_title: link_title.toString(),
        waktu_pengerjaan:waktu_pengerjaan
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

  const links = progressData?.data?.map((item) => item.link);
  const status = progressData?.data?.map((item) => item.status_progress);
  const belumDikerjakan = linksData?.data;

  return (
    <SafeAreaView className="flex justify-start h-full w-full bg-white ">
       <View className="flex flex-row justify-between p-4 items-center border-b-[0.5px] border-slate-400 bg-white">
        <Text className={`${textTitle}`}>ExamTen {fields.kelas_jurusan}</Text>
        <TouchableOpacity onPress={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView className="p-4">
        <Text>Halo, {fields.name}</Text>
        <Text>Ujian untuk {fields.kelas_jurusan}</Text>
        <Text>Ujian belum dikerjakan</Text>
        {belumDikerjakan.length > 0 ? (
          belumDikerjakan.map((item) => (
            <Card
              key={item.id}
              press={() => createProgress(item.id, item.link_name, item.link_title, item.waktu_pengerjaan)}
              link_title={item.link_title}
              time={item.waktu_pengerjaan_mulai}
              kelas_jurusan={fields.kelas_jurusan}
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
              link_title={item.link_title}
              status_progress={status[index]}
              time={item.waktu_pengerjaan_mulai}
              kelas_jurusan={fields.kelas_jurusan}
            />
          ))
        ) : (
          <Text>No links available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePageUser;
