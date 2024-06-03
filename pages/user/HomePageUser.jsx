import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  Button,
  View,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../../utils/useApi";
import BASE_API_URL from "../../constant/ip";
import { useLogout } from "../../utils/useLogout";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../admin/components/CardLinkAdmin";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import eventEmitter from "../../utils/eventEmitter";

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
  const { data: userData, error: userError } = useApi(
    `${BASE_API_URL}get-data-login`
  );
  const { postData } = useApi();
  const { logout } = useLogout();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const fetchData = async () => {
    eventLinks();
    eventProgress();
    console.log("Data refreshed");
    // Setelah data di-fetch, set refreshing ke false
  };

  const eventLinks = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${BASE_API_URL}links`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setBelumData(response.data.data);
  };
  const eventProgress = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${BASE_API_URL}progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setLinksData(response.data.data.map((item) => item.link));
    setStatusData(response.data.data.map((item) => item.status_progress));
  };

  useEffect(() => {
    eventEmitter.on('linkCreated', fetchData())
    fetchData()
  }, []);

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

  const createProgress = async (
    id,
    link_name,
    link_title,
    waktu_pengerjaan
  ) => {
    try {
      await postData(`${BASE_API_URL}progress/post`, {
        link_id: id,
        status_progress: "dikerjakan",
      });
      eventEmitter.emit('progressCreated')
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
        <Text className="text-lg font-bold">
          ExamTen {fields.kelas_jurusan}
        </Text>
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
        <Text>Halo, {fields.name}</Text>
        <Text>Ujian untuk {fields.kelas_jurusan}</Text>
        <Text>Ujian belum dikerjakan</Text>
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
