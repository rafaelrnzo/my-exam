import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Button, RefreshControl, SafeAreaView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogout } from '../../utils/useLogout';
import Card from '../admin/components/CardLinkAdmin';
import { useUpdate } from '../../utils/updateContext';
import { useApi } from '../../utils/useApi';
import BASE_API_URL from '../../constant/ip';
import io from 'socket.io-client';
import SOCKET_URL from '../../constant/ip_ws';
import { textBasic, textSubtitle, textTitle } from '../../assets/style/basic';

const HomePageUser = ({ navigation }) => {
  const { updateTrigger, triggerUpdate } = useUpdate();
  const [fields, setFields] = useState({
    name: "",
    password: "",
    token: "",
    role: "",
    kelas_jurusan: "",
  });
  const socket = io(SOCKET_URL);
  const { data: userData, error: userError, mutate: mutateUser } = useApi(`${BASE_API_URL}get-data-login`);
  const { data: linksData, mutate: mutateLinks } = useApi(`${BASE_API_URL}links`);
  const { data: progressData, mutate: mutateProgress } = useApi(`${BASE_API_URL}progress`);
  const {postData} = useApi()
  const { logout } = useLogout();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const fetchData = async() => {
    await mutateLinks();
    await mutateProgress();
    await mutateUser()
  };

  useEffect(() => {
    socket.on('fetch', (data) => {
      console.log('fetch from server', data);
      fetchData()
    })
  }, [])

  useEffect(() => {
    if (updateTrigger) {
      fetchData();
      triggerUpdate(); // Reset update trigger
    }
  }, [updateTrigger]);

  useEffect(() => {
    if (userData) {
      const fetchToken = async () => {
        const token = await AsyncStorage.getItem("token");
        setFields({
          name: userData.name,
          token: token,
          role: userData.role,
          kelas_jurusan: userData.kelas_jurusan,
        });
      };
      fetchToken();
    }
  }, [userData]);

  const createProgress = async (id, link_name, link_title, waktu_pengerjaan) => {
    try {
      await postData({
        url: `${BASE_API_URL}progress/post`,
        newData: { 
          link_id: id,
          status_progress: "dikerjakan" 
        },
      });
      socket.emit('ujian-dikerjakan')
      navigation.navigate("UjianPageUser", {
        link_id: id,
        link_name: link_name.toString(),
        link_title: link_title.toString(),
        waktu_pengerjaan: waktu_pengerjaan,
      });
    } catch (error) {
      console.log("Error creating progress:", error);
    }
  };

  if (userError) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const belumData = linksData?.data || [];
  const links = progressData?.data?.map((item) => item.link) || [];
  const status = progressData?.data?.map((item) => item.status_progress) || [];

  return (
    <SafeAreaView className="flex justify-start h-full w-full bg-white">
      <View className="flex flex-row justify-between p-4 items-center border-b-[0.5px] border-slate-400 bg-white">
        <Text className="text-lg font-bold">ExamTen {fields.kelas_jurusan}</Text>
        <TouchableOpacity onPress={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className={`${textTitle}`}>Halo, {fields.name}</Text>
        <Text className={`${textBasic}`}>Ujian untuk {fields.kelas_jurusan}</Text>
        <Text className={`${textBasic}`}>Ujian belum dikerjakan</Text>
        {belumData.length > 0 ? (
          belumData.map((item) => (
            <Card
              key={item.id}
              press={() =>
                createProgress(
                  item.id,
                  item.link_name,
                  item.link_title,
                  item.waktu_pengerjaan
                )
              }
              link_title={item.link_title}
              time={item.waktu_pengerjaan_mulai}
              kelas_jurusan={fields.kelas_jurusan}
            />
          ))
        ) : (
          <Text>No links available</Text>
        )}
        <Text className={`${textBasic} mt-2`}>Ujian Sudah Dikerjakan</Text>
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
