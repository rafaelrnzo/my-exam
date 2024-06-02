import React, { useEffect, useState } from 'react';
import { ScrollView, Text, Button, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApi } from '../../utils/useApi';
import BASE_API_URL from '../../constant/ip';
import { useLogout } from '../../utils/useLogout';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [belumData, setBelumData] = useState([]);
  const [linksData, setLinksData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const { data: userData, error: userError } = useApi(`${BASE_API_URL}get-data-login`);
  const { postData } = useApi();
  const { logout } = useLogout();

  const streamEventLinks = async () => {
    const token = await AsyncStorage.getItem("token");
    const eventSource = new CustomEventSource(`${BASE_API_URL}links`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data).data;
      setBelumData(data);
    });
    return eventSource;
  };

  const streamEventProgress = async () => {
    const token = await AsyncStorage.getItem("token");
    const eventSource = new CustomEventSource(`${BASE_API_URL}stream-user-progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data).data;
      setLinksData(data.map((item) => item.link));
      setStatusData(data.map((item) => item.status_progress));
    });
    return eventSource;
  };

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

  useEffect(() => {
    let eventSourceLinks, eventSourceProgress;

    const startStreamEvents = async () => {
      eventSourceLinks = await streamEventLinks();
      eventSourceProgress = await streamEventProgress();
    };

    startStreamEvents();

    return () => {
      if (eventSourceLinks) eventSourceLinks.close();
      if (eventSourceProgress) eventSourceProgress.close();
    };
  }, []);

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

  return (
    <SafeAreaView className="flex justify-start h-full w-full bg-white ">
      <View className="flex flex-row justify-between p-4 items-center border-b-[0.5px] border-slate-400 bg-white">
        <Text className="text-lg font-bold">ExamTen {fields.kelas_jurusan}</Text>
        <TouchableOpacity onPress={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView className="p-4">
        <Text>Halo, {fields.name}</Text>
        <Text>Ujian untuk {fields.kelas_jurusan}</Text>
        <Text>Ujian belum dikerjakan</Text>
        {belumData.length > 0 ? (
          belumData.map((item) => (
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
        {linksData.length > 0 ? (
          linksData.map((item, index) => (
            <Card
              key={item.id}
              link_title={item.link_title}
              status_progress={statusData[index]}
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
