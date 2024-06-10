import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogout } from "../../utils/useLogout";
import { useApi } from "../../utils/useApi";
import { useUpdate } from "../../utils/updateContext";
import BASE_API_URL from "../../constant/ip";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faEllipsisVertical,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { textBasic, textTitle } from "../../assets/style/basic";
import StatusMonitoringModal from "./components/StatusMonitoringModal";
import io from "socket.io-client";
import SOCKET_URL from "../../constant/ip_ws";
import { Circle, Ellipse } from "react-native-svg";

const MonitoringPage = ({ navigation, route }) => {
  const { updateTrigger, triggerUpdate } = useUpdate();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const { kelas_jurusan_id, kelas_jurusan } = route.params;
  const [url, setUrl] = useState(
    `${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan_id=${kelas_jurusan_id}`
  );
  const [searchQuery, setSearchQuery] = useState("");

  const socket = io(SOCKET_URL);

  const { data, error, isLoading, putData, mutate } = useApi(url);
  const { logout } = useLogout();

  const users = data?.data?.data.map((item) => item.user) || [];
  const links = data?.data?.data.map((item) => item.link) || [];
  const status = data?.data?.data.map((item) => item.status_progress) || [];
  const paginations = data?.data?.links || [];

  const filteredUsers = useMemo(() => {
    if (searchQuery === "") {
      return users;
    }
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, users]);

  const handleOpenModal = (userIndex, id) => {
    setCurrentUser(userIndex);
    setCurrentId(id);
    setModalVisible(true);
  };

  const handleUpdateStatus = async (newStatus, userId) => {
    try {
      await putData({
        url: `${BASE_API_URL}progress/${userId}`,
        updatedData: { status_progress: newStatus },
      });
      socket.emit("progressUpdated");
    } catch (error) {
      console.error("Error updating status:", error, newStatus);
    }
  };

  const handleLinkPress = (newUrl) => {
    setUrl(
      newUrl
        ? newUrl
        : `${BASE_API_URL}admin-sekolah/monitoring?kelas_jurusan_id=${kelas_jurusan_id}`
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const fetchData = async () => {
    mutate(url);
    console.log("Data refreshed");
  };

  useEffect(() => {
    if (updateTrigger) {
      mutate();
      triggerUpdate();
    }
  }, [updateTrigger, triggerUpdate, mutate]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("ujian-change-callback", () => {
      fetchData();
    });
    socket.on("ujian-dikerjakan-callback", () => {
      fetchData();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (error) {
    return (
      <View>
        <Text>Error</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-white flex items-center w-full flex-row py-2">
        <View className="w-full flex flex-row max-w-screen items-center px-4">
          <View className="flex-none">
            <TouchableOpacity onPress={() => navigation.pop()} className="p-4">
              <FontAwesomeIcon icon={faArrowLeft} color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-grow border border-slate-300 px-4 p-2 rounded-lg flex flex-row items-center">
            <View className="px-2">
              <FontAwesomeIcon icon={faSearch} color="#cbd5e1" />
            </View>
            <TextInput
              className=""
              placeholder="Search by name"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
        </View>
      </View>
      <ScrollView
        className="flex flex-col gap-3 px-4 mt-2 flex-2 bg-slate-50"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredUsers.length === 0 ? (
          <Text>tidak ada user ujian</Text>
        ) : (
          filteredUsers.map((user, index) => (
            <View
              key={links[index].id}
              className="p-3 border border-slate-300 bg-white rounded-lg w-auto flex"
            >
              <View className="flex-row flex justify-between">
                <Text className={textTitle}>{user.name}</Text>
                <TouchableOpacity
                  onPress={() => handleOpenModal(index, data.data.data[index].id)}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} color="black" />
                </TouchableOpacity>
              </View>
              <Text className={textBasic}>
                Mengerjakan {links[index]?.link_title}
              </Text>
              <View className="flex flex-row items-center gap-x-2">
                <FontAwesomeIcon icon={faCircle} color="black" size={8} className={` ${status[index] === "keluar"
                  ? "text-red-500 font-medium text-center"
                  : status[index] === "selesai"
                    ? "bg-green-400 p-2 mt-2 rounded-lg border text-center"
                    : status[index] === "dikerjakan"
                      ? "bg-blue-400 p-2 mt-2 rounded-lg border text-center"
                      : "bg-transparent p-2 mt-2 border-slate-300 border text-center rounded text-slate-500"
                  }`} />
                <Text
                  className={`${textBasic} ${status[index] === "keluar"
                    ? "text-red-500 font-medium text-center"
                    : status[index] === "selesai"
                      ? "bg-green-400 p-2 mt-2 rounded-lg border text-center"
                      : status[index] === "dikerjakan"
                        ? "bg-blue-400 p-2 mt-2 rounded-lg border text-center"
                        : "bg-transparent p-2 mt-2 border-slate-300 border text-center rounded text-slate-500"
                    }`}
                >
                  {status[index]}
                </Text>
              </View>

            </View>
          ))
        )}
        {currentUser !== null && (
          <StatusMonitoringModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onUpdateStatus={(newStatus) => handleUpdateStatus(newStatus, currentId)}
            currentStatus={status[currentUser]}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MonitoringPage;
